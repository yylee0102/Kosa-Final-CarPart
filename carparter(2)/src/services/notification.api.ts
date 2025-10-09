// 백엔드의 응답 DTO와 일치하는 타입 정의
export interface NotificationResDTO {
  id: number;
  message: string;
  isRead: boolean;
  url: string | null;
  createTime: string;
}

// API 기본 URL
const API_BASE_URL = '/api';

/**
 * 인증 토큰을 포함한 기본 헤더를 생성하는 헬퍼 함수
 */
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const notificationApi = {
  /**
   * 실시간 알림 구독 (EventSource 객체를 반환)
   */
  subscribe: (): EventSource => {
     const token = localStorage.getItem('authToken');
    if (!token) {
        // 토큰이 없으면 연결 시도조차 하지 않도록 처리
        throw new Error("로그인이 필요합니다.");
    }
    // SSE는 일반 fetch와 다르므로 EventSource API를 직접 사용합니다.
    // 인증이 필요하다면 백엔드에서 URL 파라미터로 토큰을 받도록 수정해야 할 수 있습니다.
    return new EventSource(`${API_BASE_URL}/notifications/subscribe?token=${token}`);
  },

  /**
   * 현재 로그인한 사용자의 모든 알림 목록을 조회
   */
  getMyNotifications: async (): Promise<NotificationResDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('알림 목록을 가져오는 데 실패했습니다.');
    }
    return response.json();
  },

  /**
   * 안 읽은 알림 개수 조회
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('안 읽은 알림 개수를 가져오는 데 실패했습니다.');
    }
    // 백엔드가 숫자만 반환하므로 .json()이 아닌 .text()로 받고 숫자로 변환
    const countText = await response.text();
    return parseInt(countText, 10);
  },

  /**
   * 특정 알림을 '읽음' 상태로 변경
   */
  markAsRead: async (notificationId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('알림을 읽음 처리하는 데 실패했습니다.');
    }
  },
};

export default notificationApi;

