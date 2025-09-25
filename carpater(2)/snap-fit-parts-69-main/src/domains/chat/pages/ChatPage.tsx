import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Smile, MoreVertical, Search, Phone, Video, MessageCircle, Bot } from "lucide-react";
import { formatTimeAgo } from "@/shared/utils/format";

interface ChatRoom {
  id: string;
  type: "part" | "center" | "general" | "bot" | "estimate";
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isOnline?: boolean;
  relatedId?: string;
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: "text" | "image" | "file";
  createdAt: string;
  isRead: boolean;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // API 연결: 채팅방 목록 조회
    // GET /api/chat/rooms
    fetchChatRooms();
  }, [location]);

  useEffect(() => {
    if (selectedRoom) {
      // API 연결: 선택된 채팅방의 메시지 조회
      // GET /api/chat/rooms/:roomId/messages
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);

      // 임시 데이터 (실제로는 API 호출)
      const mockRooms: ChatRoom[] = [
        {
          id: "bot",
          type: "bot",
          name: "카파트너 고객상담",
          avatar: "/placeholder.svg",
          lastMessage: "안녕하세요! 무엇을 도와드릴까요?",
          lastMessageAt: "2024-01-15T09:00:00Z",
          unreadCount: 0,
          isOnline: true
        },
        {
          id: "1",
          type: "center",
          name: "믿음 자동차 정비소",
          avatar: "/placeholder.svg",
          lastMessage: "브레이크 패드 교체 견적을 보내드렸습니다.",
          lastMessageAt: "2024-01-15T10:30:00Z",
          unreadCount: 1,
          isOnline: true,
          relatedId: "center1"
        },
        {
          id: "2",
          type: "center",
          name: "스피드카센터",
          avatar: "/placeholder.svg",
          lastMessage: "헤드라이트 부품 재고 확인해드리겠습니다.",
          lastMessageAt: "2024-01-14T15:45:00Z",
          unreadCount: 2,
          isOnline: false,
          relatedId: "center2"
        }
      ];

      setChatRooms(mockRooms);
      if (mockRooms.length > 0) {
        setSelectedRoom(mockRooms[0]);
      }
    } catch (error) {
      console.error("채팅방 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          roomId: "bot",
          senderId: "bot",
          senderName: "카파트너 도우미",
          content: "안녕하세요! 카파트너 도우미입니다. 🚗\n\n무엇을 도와드릴까요?",
          messageType: "text",
          createdAt: "2024-01-15T09:00:00Z",
          isRead: true
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("메시지 조회 실패:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      roomId: selectedRoom.id,
      senderId: "me",
      senderName: "나",
      content: newMessage.trim(),
      messageType: "text",
      createdAt: new Date().toISOString(),
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
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
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                    selectedRoom?.id === room.id ? 'bg-primary/10' : 'hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {room.type === "bot" ? <Bot className="h-5 w-5" /> : room.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-on-surface">{room.name}</span>
                      <p className="text-sm text-on-surface-variant truncate">{room.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              <div className="p-4 border-b border-outline-variant">
                <h3 className="font-medium text-on-surface">{selectedRoom.name}</h3>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-lg max-w-[70%] ${
                        message.senderId === "me" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-surface border border-outline-variant text-on-surface"
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-outline-variant">
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