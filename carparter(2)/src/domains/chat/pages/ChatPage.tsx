import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search } from "lucide-react";
import { Client, StompSubscription } from '@stomp/stompjs'; // ✅ WebSocket 라이브러리 임포트
import SockJS from 'sockjs-client';     // ✅ WebSocket 라이브러리 임포트
import { ChatApiService } from "@/services/chat.api"; // ✅ 실제 API 서비스 임포트
import { ChatRoom, ChatMessage } from "@/types/chat.types";
import { useAuth } from "@/shared/contexts/AuthContext"; 

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<Client | null>(null); // ✅ Stomp 클라이언트 인스턴스를 저장할 ref

  // ✅ 구독 객체를 저장하기 위한 ref 추가
  const subscriptionRef = useRef<StompSubscription | null>(null);

  // 1. 채팅방 목록을 실제 API로 불러오기
  useEffect(() => {
    const fetchAndSelectInitialRoom = async () => {
      setLoading(true);
      try {
        const rooms = await ChatApiService.fetchChatRooms(); // ✅ Mock -> Real API
        const { roomId } = location.state || {};
        let roomToSelect: ChatRoom | null = null;

        if (roomId) {
          // 전달받은 roomId와 일치하는 방을 찾습니다.
          roomToSelect = rooms.find(room => room.roomId === roomId) || null;
          navigate(location.pathname, { replace: true, state: {} });
        } else if (rooms.length > 0) {
          // 전달받은 roomId가 없으면 그냥 첫 번째 방을 선택합니다.
          roomToSelect = rooms[0];
        }

        setChatRooms(rooms);
        setSelectedRoom(roomToSelect);
      } catch (error) {
        console.error("채팅방 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSelectInitialRoom();
  }, []);

  // 2. 선택된 채팅방이 바뀌면 -> 이전 대화내역 로드 + WebSocket 연결
  useEffect(() => {
    if (!selectedRoom) return;

    // ✅ roomId가 실제 DB에 존재하는 방일 경우에만 API를 호출하도록 조건 추가
    if (selectedRoom.roomId && !selectedRoom.roomId.toString().startsWith('temp-id-')) {
      ChatApiService.fetchChatHistory(selectedRoom.roomId).then(setMessages);
    } else {
      // 새로운 방(임시 ID)이면 메시지 목록을 그냥 비워둠
      setMessages([]);
    }

    // StompJS의 Client 객체를 생성하기 전에 토큰을 가져옵니다.
    const token = localStorage.getItem('authToken');

    // WebSocket 연결
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9000/ws-chat'),
      // ✅ 이 부분이 가장 중요합니다. 연결 시 JWT 토큰을 헤더에 담아 보냅니다.
      connectHeaders: {
        Authorization: `Bearer ${token}`
      }, // 백엔드 포트 9000
      onConnect: () => {
        console.log(`WebSocket 연결 성공! /topic/room/${selectedRoom.roomId} 구독 시작`);
        
        // 해당 채팅방의 주제(topic)를 구독
        client.subscribe(`/topic/room/${selectedRoom.roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          // ▼▼▼ 핵심 수정 부분 ▼▼▼
          // 서버에서 받은 메시지를 보낸 사람이 '나' 자신인지 확인합니다.
          if (receivedMessage.senderId === user?.id) {
            // '나'인 경우: 기존의 임시 메시지를 진짜 메시지로 교체합니다.
            // temp-로 시작하는 모든 메시지를 지우고, 서버에서 받은 메시지를 추가하는 방식이 가장 안정적입니다.
            setMessages(prev => [
      // ✅ msg.messageId가 존재하고, temp-로 시작하는지 안전하게 확인합니다.
              ...prev.filter(msg => !(msg.messageId && msg.messageId.startsWith('temp-'))),
              receivedMessage
        ]);
          } else {
            // '상대방'인 경우: 기존처럼 메시지 목록에 추가합니다.
            setMessages(prev => [...prev, receivedMessage]);
          }
          // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
          // 사이드바 마지막 메시지 업데이트
          setChatRooms(prevRooms => prevRooms.map(room => 
            room.roomId === receivedMessage.roomId 
              ? { ...room, lastMessage: receivedMessage.content } 
              : room
          ));
        });
      },
      onStompError: (frame) => console.error('Broker reported error:', frame.headers['message']),
    });

    client.activate();
    clientRef.current = client;

    // 컴포넌트가 언마운트되거나, 다른 채팅방을 선택할 때 연결 해제
    return () => {
      if (client.active) {
        console.log('WebSocket 연결 해제');
        client.deactivate();
      }
    };
  }, [selectedRoom]);

  // 메시지가 업데이트될 때마다 맨 아래로 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // 3. 메시지 전송 (WebSocket publish)
  const handleSendMessage = () => {
  if (!newMessage.trim() || !selectedRoom || !clientRef.current?.active || !user) return;

  // 1. 내가 보낸 메시지를 화면에 즉시 표시하기 위한 '임시' 메시지 객체를 만듭니다.
  //    백엔드에서 보내줄 최종 데이터와 구조를 최대한 비슷하게 맞춥니다.
  const optimisticMessage: ChatMessage = {
    messageId: `temp-${Date.now()}`, // 임시 고유 ID
    roomId: selectedRoom.roomId,
    senderId: user.id,
    senderName: user.name,
    senderType: user.role === "ROLE_CAR_CENTER" ? "CAR_CENTER" : "USER", 
    content: newMessage.trim(),
    createdAt: new Date().toISOString(),
  };

  // 2. 이 임시 메시지를 messages 상태에 바로 추가하여 화면에 렌더링합니다.
  setMessages(prev => [...prev, optimisticMessage]);

  // 3. 백엔드로는 기존과 동일하게 content만 보냅니다.
  const messageToSend = {
    content: newMessage.trim(),
  };
  clientRef.current.publish({
    destination: `/app/chat/send/${selectedRoom.roomId}`,
    body: JSON.stringify(messageToSend),
  });

  // 4. 입력창을 비웁니다.
  setNewMessage("");
};

  if (loading) {
    return (
      <PageContainer showFooter={false}>
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-on-surface-variant">채팅을 불러오는 중...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer showFooter={false}>
      <div className="h-[calc(100vh-64px)] flex">
        {/* 채팅방 목록 */}
        <div className="w-80 border-r border-outline-variant flex flex-col">
          <div className="p-4 border-b border-outline-variant">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <Input
                placeholder="채팅방 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {chatRooms.map((room) => {
                // 내가 CAR_CENTER로 로그인했다면 → 상대는 '사용자'
                // 내가 USER로 로그인했다면 → 상대는 '카센터'
                const opponent =
                  user?.role === 'ROLE_CAR_CENTER'
                    ? room.user      // 내가 카센터면 상대는 '유저'
                    : room.carCenter; // 내가 유저면 상대는 '카센터'

                // 상대방 이름이 없을 경우를 대비한 기본값 설정
                const opponentName = opponent?.name || '알 수 없는 상대';
                const opponentInitial = opponentName[0].toUpperCase();
                return (
                <button
                  key={room.roomId}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                    selectedRoom?.roomId === room.roomId ? 'bg-primary/10' : 'hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{opponentInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-on-surface">{opponentName}</span>
                      <p className="text-sm text-on-surface-variant truncate">{room.lastMessage}</p>
                    </div>
                  </div>
                </button>
                );
    })}
            </div>
          </ScrollArea>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              <div className="p-4 border-b border-outline-variant">
                <h3 className="font-medium text-on-surface">{selectedRoom.carCenter.name}</h3>
              </div>
              <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => {
                  // [수정] 현재 로그인한 유저의 고유 ID(user.id)와
                  //       메시지를 보낸 사람의 고유 ID(message.senderId)를 비교해야 합니다.
                  const isMyMessage = user?.id === message.senderId;
                    
                    return (
                      <div
                        key={message.messageId}
                        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-2`}
                      >
                        <div
                          className={`max-w-[70%] flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
                        >
                          {!isMyMessage && (
                            <span className="mb-1 text-xs text-muted-foreground">
                              {message.senderName ??
                                (message.senderType === "CAR_CENTER" ? "카센터" : "사용자")}
                            </span>
                          )}
                          <div
                            className={`rounded-2xl px-3 py-2 leading-relaxed shadow-sm ${
                              isMyMessage
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-surface border border-outline-variant text-on-surface rounded-bl-sm"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-outline-variant bg-white">
                <div className="flex items-end gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-on-surface-variant">채팅방을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}