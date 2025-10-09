// 파일 경로: src/services/chat.api.ts (새 파일)

import { ChatRoom, ChatMessage } from '@/types/chat.types';

const API_BASE_URL = '/api/chat';

// 인증 토큰을 가져오는 함수 (다른 api 파일에 이미 있다면 재사용)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const ChatApiService = {

        // ▼▼▼ 이 함수를 새로 추가하세요 ▼▼▼
    /**
     * 특정 카센터와의 채팅방을 생성하거나 조회하는 API
     * POST /api/chat/rooms
     */
    async createOrGetChatRoom(data : {centerId: string,estimateId:number}): Promise<ChatRoom> {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      // ✅ body에 포함되는 키를 'centerId'로 변경합니다.
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('채팅방을 생성하거나 불러오는데 실패했습니다.');
    }
    return response.json();
  },
  /**
   * 내 채팅방 목록을 조회하는 API
   * GET /api/chat/rooms
   */
  async fetchChatRooms(): Promise<ChatRoom[]> {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('채팅방 목록을 불러오는데 실패했습니다.');
    }
    return response.json();
  },

  /**
   * 특정 채팅방의 이전 대화 내역을 조회하는 API
   * GET /api/chat/history/{roomId}
   */
  async fetchChatHistory(roomId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${API_BASE_URL}/history/${roomId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('대화 내역을 불러오는데 실패했습니다.');
    }
    return response.json();
  },
};