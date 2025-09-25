// 사용자 관련 종합 API 서비스 - 백엔드 DTO에 맞춰 수정
const API_BASE_URL = '/api';

// ==================== 사용자 관련 타입 정의 ====================
export interface QuoteRequestReqDTO {
  userId: string;
  userCarId: number;
  requestDetails: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface QuoteRequestResDTO {
  requestId: number;
  requestDetails: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  writer: {
    userId: string;
    name: string;
  };
  car: {
    userCarId: number;
  };
  images: {
    imageId: number;
    imageUrl: string;
  }[];
  estimateCount: number;
}

export interface ReviewReqDTO {
  centerId: string;
  rating: number;
  content: string;
}

export interface ReviewResDTO {
  reviewId: number;
  centerName: string;
  writerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface UserResDTO {
  userId: string;
  name: string;
  phoneNumber: string;
  marketingAgreed: boolean;
}

export interface CompletedRepairResDTO {
  repairId: number;
  repairDetail: string;
  completionDate: string;
  userId: string;
  userName: string;
  centerId: string;
  centerName: string;
}

export interface CsInquiryReqDTO {
  title: string;
  questionContent: string;
}

export interface CsInquiryResDTO {
  inquiryId: number;
  userName: string;
  title: string;
  questionContent: string;
  answerContent?: string;
  answeredAt?: string;
  createdAt: string;
}

// ==================== 사용자 API 서비스 ====================
class UserApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': token || '',
      'Content-Type': 'application/json',
    };
  }

  /**
   * 견적 요청 생성
   * POST /api/users/quote-requests
   */
  async createQuoteRequest(request: QuoteRequestReqDTO, images: File[]): Promise<void> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch(`${API_BASE_URL}/users/quote-requests`, {
      method: 'POST',
      headers: {
        'Authorization': localStorage.getItem('authToken') || '',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('견적 요청 생성에 실패했습니다.');
    }
  }

  /**
   * 내 견적 요청 목록 조회
   * GET /api/users/my-quote-requests
   */
  async getMyQuoteRequests(): Promise<QuoteRequestResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/my-quote-requests`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('견적 요청 목록 조회에 실패했습니다.');
    }

    return response.json();
  }

  /**
   * 리뷰 작성
   * POST /api/users/reviews
   */
  async createReview(review: ReviewReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/reviews`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('리뷰 작성에 실패했습니다.');
    }
  }

  /**
   * 리뷰 목록 조회
   * GET /api/users/reviews
   */
  async getMyReviews(): Promise<ReviewResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/reviews`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('리뷰 목록 조회에 실패했습니다.');
    }

    return response.json();
  }

  /**
   * 사용자 프로필 조회
   * GET /api/users/profile
   */
  async getUserProfile(): Promise<UserResDTO> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('프로필 조회에 실패했습니다.');
    }

    return response.json();
  }

  /**
   * 완료된 수리 내역 조회
   * GET /api/users/completed-repairs
   */
  async getCompletedRepairs(): Promise<CompletedRepairResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/completed-repairs`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('완료된 수리 내역 조회에 실패했습니다.');
    }

    return response.json();
  }

  /**
   * CS 문의 생성
   * POST /api/users/cs
   */
  async createCsInquiry(inquiry: CsInquiryReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/cs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inquiry),
    });

    if (!response.ok) {
      throw new Error('문의 생성에 실패했습니다.');
    }
  }

  /**
   * 내 CS 문의 목록 조회
   * GET /api/users/cs
   */
  async getMyCsInquiries(): Promise<CsInquiryResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/cs`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('문의 목록 조회에 실패했습니다.');
    }

    return response.json();
  }
}

export default new UserApiService();