// 알림 관련 API 서비스
export interface NotificationData {
  id: string;
  type: "estimate" | "message" | "review" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export class NotificationApiService {
  private baseUrl = "/api/notifications";

  /**
   * SSE 연결을 통한 실시간 알림 구독
   * 로그인한 사용자의 실시간 알림을 받기 위한 SSE 연결
   */
  subscribeToNotifications(): EventSource {
    // TODO: API 연결 - 실시간 알림 구독
    // GET /api/notifications/subscribe (SSE)
    const eventSource = new EventSource(`${this.baseUrl}/subscribe`, {
      withCredentials: true
    });

    return eventSource;
  }

  /**
   * 사용자의 모든 알림 조회
   */
  async getMyNotifications(): Promise<NotificationData[]> {
    try {
      // TODO: API 연결 - 내 알림 목록 조회
      // GET /api/notifications/my
      const response = await fetch(`${this.baseUrl}/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("알림 조회 실패");
      }

      return await response.json();
    } catch (error) {
      console.error("알림 조회 오류:", error);
      // 시뮬레이션 데이터 반환
      return [
        {
          id: "1",
          type: "estimate",
          title: "새로운 견적서 도착",
          message: "서울 오토케어에서 견적서를 보냈습니다.",
          isRead: false,
          createdAt: "2024-01-15T10:30:00Z",
          userId: "user123"
        },
        {
          id: "2",
          type: "review",
          title: "새로운 리뷰",
          message: "고객님이 리뷰를 남겨주셨습니다.",
          isRead: true,
          createdAt: "2024-01-14T15:20:00Z",
          userId: "user123"
        }
      ];
    }
  }

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // TODO: API 연결 - 알림 읽음 처리
      // PUT /api/notifications/{id}/read
      const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("알림 읽음 처리 실패");
      }
    } catch (error) {
      console.error("알림 읽음 처리 오류:", error);
      // 에러 무시 (시뮬레이션)
    }
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(): Promise<void> {
    try {
      // TODO: API 연결 - 모든 알림 읽음 처리
      // PUT /api/notifications/read-all
      const response = await fetch(`${this.baseUrl}/read-all`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("모든 알림 읽음 처리 실패");
      }
    } catch (error) {
      console.error("모든 알림 읽음 처리 오류:", error);
      // 에러 무시 (시뮬레이션)
    }
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      // TODO: API 연결 - 알림 삭제
      // DELETE /api/notifications/{id}
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("알림 삭제 실패");
      }
    } catch (error) {
      console.error("알림 삭제 오류:", error);
      throw error;
    }
  }

  /**
   * 읽지 않은 알림 개수 조회
   */
  async getUnreadCount(): Promise<number> {
    try {
      // TODO: API 연결 - 읽지 않은 알림 개수
      // GET /api/notifications/unread-count
      const response = await fetch(`${this.baseUrl}/unread-count`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("읽지 않은 알림 개수 조회 실패");
      }

      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error("읽지 않은 알림 개수 조회 오류:", error);
      // 시뮬레이션 데이터 반환
      return 3;
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem("authToken") || "";
  }
}

// 싱글톤 인스턴스 내보내기
export default new NotificationApiService();