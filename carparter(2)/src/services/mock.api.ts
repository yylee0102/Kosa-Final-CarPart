// src/services/mock.api.ts (새 파일로 생성)

import { ChatRoom, ChatMessage } from '@/types/chat.types';

// 초기 목(Mock) 데이터
let mockChatRooms: ChatRoom[] = [
  {
    roomId: '1',
    centerId: 'center1',
    centerName: '강남 오토 서비스',
    lastMessage: '네, 예약 가능합니다.',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 1,
  },
  {
    roomId: '2',
    centerId: 'center2',
    centerName: '믿음 자동차 정비소',
    lastMessage: '부품 재고 확인 후 연락드리겠습니다.',
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(), // 어제
    unreadCount: 0,
  },
];

let mockMessages: { [key: string]: ChatMessage[] } = {
  '1': [
    { messageId: '101', roomId: '1', senderId: 'center1', senderName: '강남 오토 서비스', content: '안녕하세요. 문의 확인했습니다.', createdAt: new Date().toISOString() },
    { messageId: '102', roomId: '1', senderId: 'user1', senderName: '나', content: '네, 엔진오일 교체 예약 가능한가요?', createdAt: new Date().toISOString() },
  ],
  '2': [],
};

// 가짜 API 서비스
export const MockChatApiService = {
  // 채팅방 목록 가져오기 (시뮬레이션)
  fetchMockChatRooms: (): Promise<ChatRoom[]> => {
    console.log('[MOCK API] 채팅방 목록 요청');
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('[MOCK API] 채팅방 목록 응답:', mockChatRooms);
        resolve([...mockChatRooms]);
      }, 500); // 0.5초 지연
    });
  },

  // 특정 채팅방의 메시지 가져오기 (시뮬레이션)
  fetchMockMessages: (roomId: string): Promise<ChatMessage[]> => {
    console.log(`[MOCK API] '${roomId}'번 방 메시지 요청`);
    return new Promise(resolve => {
      setTimeout(() => {
        const messages = mockMessages[roomId] || [];
        console.log(`[MOCK API] '${roomId}'번 방 메시지 응답:`, messages);
        resolve([...messages]);
      }, 300); // 0.3초 지연
    });
  },
  
  // 메시지 전송 및 자동 응답 (WebSocket 시뮬레이션)
  sendMockMessage: (roomId: string, message: Omit<ChatMessage, 'messageId' | 'createdAt'>, onReceiveReply: (reply: ChatMessage) => void): Promise<ChatMessage> => {
    const sentMessage: ChatMessage = {
      ...message,
      messageId: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    console.log(`[MOCK API] '${roomId}'번 방에 메시지 전송:`, sentMessage);

    // 보낸 메시지를 데이터에 추가
    if (!mockMessages[roomId]) mockMessages[roomId] = [];
    mockMessages[roomId].push(sentMessage);

    // "상대방이 메시지를 읽고 답장하는" 상황 시뮬레이션
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        messageId: (Date.now() + 1).toString(),
        roomId: roomId,
        senderId: 'center1', // 혹은 roomId에 맞는 centerId
        senderName: '상대방', // 혹은 roomId에 맞는 centerName
        content: `"${message.content}" 라고 보내신 메시지 잘 받았습니다.`,
        createdAt: new Date().toISOString(),
      };
      console.log(`[MOCK API] 자동 응답 생성:`, replyMessage);
      mockMessages[roomId].push(replyMessage);
      onReceiveReply(replyMessage); // 콜백 함수로 응답 전달
    }, 1500); // 1.5초 후 답장

    return Promise.resolve(sentMessage);
  }
};