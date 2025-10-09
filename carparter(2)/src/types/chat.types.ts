// src/types/chat.types.ts (새 파일로 생성)

// User와 CarCenter 정보를 담을 공통 타입
interface Participant {
  id: string;
  name: string;
}

export interface ChatRoom {
  roomId: string;
  user: Participant;
  carCenter: Participant; // ✅ centerName, centerId 대신 carCenter 객체를 사용
  updatedAt: string;
  lastMessage?: string;
}

export interface ChatMessage {
  messageId: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'CAR_CENTER'; // ✅ [추가] 보낸 사람의 타입을 명시
  content: string;
  createdAt: string;
}