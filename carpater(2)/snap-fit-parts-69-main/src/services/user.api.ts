// 사용자 관련 종합 API 서비스 - 백엔드 DTO에 맞춰 수정
const API_BASE_URL = '/api';

// 백엔드의 QuoteRequestReqDTO와 일치하는 타입 정의
export interface QuoteRequestReqDTO {
  userCarId: number;
  requestDetails: string;
  address: string;
  latitude?: number;
  longitude?: number;
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
    // ✅ 백엔드 DTO에 맞춰 carModel, modelYear도 추가해주는 것이 좋습니다.
    carModel: string;
    modelYear: number;
  };
  images: {
    imageId: number;
    imageUrl: string;
  }[];
  estimateCount: number;

  // ✅ [추가] 이 부분이 빠져있습니다. 백엔드에서 보내주는 견적 목록을 추가해주세요.
  estimates: Estimate[];
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
    // ✅ 백엔드 DTO에 맞춰 carModel, modelYear도 추가해주는 것이 좋습니다.
    carModel: string;
    modelYear: number;
  };
  images: {
    imageId: number;
    imageUrl: string;
  }[];
  estimateCount: number;

  // ✅ [추가] 이 부분이 빠져있습니다. 백엔드에서 보내주는 견적 목록을 추가해주세요.
  estimates: Estimate[];
}


// ✅ [추가] 백엔드의 EstimateResDTO에 맞춰 Estimate 타입을 정의합니다.
export interface Estimate {
  estimateId: number;
  centerName: string;
  estimatedCost: number;
  details: string;
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

// ✅ [추가] 내 차량 정보 응답 DTO
export interface UserCarResDTO {
  userCarId: number;
  carModel: string;
  carNumber: string;
  modelYear: number;
  createdAt: string; // 또는 Date
}

// ✅ [추가] 내 차량 생성/수정 요청 DTO
export interface UserCarReqDTO {
  carModel: string;
  carNumber: string;
  modelYear: number;
}

// ==================== 사용자 API 서비스 ====================
class UserApiService {

   private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return {
      // ✅ [수정] 토큰이 존재할 경우, 표준에 맞는 'Bearer ' 접두사를 추가합니다.
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  


  // FormData와 함께 사용할 헤더 (Content-Type 제외)
  private getAuthHeadersForFormData(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return {
        // ✅ [수정] 여기에도 동일하게 'Bearer ' 접두사를 추가합니다.
        'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * 견적 요청 생성
   * POST /api/users/quote-requests
   */
  /**
   * ✅ 신규 견적 요청 생성 API (이미지 포함)
   * @param request - 견적 요청 정보 (JSON)
   * @param images - 첨부할 이미지 파일 목록
   */
  async createQuoteRequest(request: QuoteRequestReqDTO, images: File[]): Promise<void> {
    const formData = new FormData();

    // 1. DTO 객체는 JSON 문자열로 변환하여 'request'라는 이름의 파트로 추가
    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );

    // 2. 이미지 파일들은 'images'라는 이름의 파트로 각각 추가
    images.forEach(image => {
      formData.append('images', image);
    });

    const response = await fetch(`${API_BASE_URL}/users/quote-requests`, { // ✅ 최종 엔드포인트
      method: 'POST',
      headers: {
         // ✅ [수정된 코드] 이 클래스에 이미 정의된 getAuthHeadersForFormData()를 사용해야 합니다.
        ...this.getAuthHeadersForFormData(),
      },
      body: formData,
    });

if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error('견적 요청 생성에 실패했습니다.');
    }
  }



  /**
   * 내 견적 요청 목록 조회
   * GET /api/users/my-quote-requests
   */
  async getMyQuoteRequest(): Promise<QuoteRequestResDTO> {
    const response = await fetch(`${API_BASE_URL}/users/my-quote-request`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('견적 요청 목록 조회에 실패했습니다.');
    }

    return response.json();
  }

  /**
   * 내 견적 요청 삭제
   * DELETE /api/users/quote-requests/{id}
   */
  async deleteQuoteRequest(quoteRequestId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/quote-requests/${quoteRequestId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('견적 요청 삭제에 실패했습니다.');
    }
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
   * GET /api/users/my-reviews
   */
  async getMyReviews(): Promise<ReviewResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/my-reviews`, {
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
    const response = await fetch(`${API_BASE_URL}/users/my-completed-repairs`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('완료된 수리 내역 조회에 실패했습니다.');
    }

    return response.json();
  }


  /**
   * ✅ [신규 추가] 내 차량 목록 조회
   * GET /api/users/vehicles
   */
  async getMyVehicles(): Promise<UserCarResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/vehicles`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('내 차량 목록 조회에 실패했습니다.');
    }
    return response.json();
  }
  /**
   * ✅ [신규 추가] 내 차량 생성
   * POST /api/users/vehicles
   */
  async createMyVehicle(vehicleData: UserCarReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/vehicles`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      throw new Error('차량 생성에 실패했습니다.');
    }
  }

  /**
   * ✅ [신규 추가] 내 차량 정보 수정
   * PUT /api/users/vehicles/{id}
   */
  async updateMyVehicle(vehicleId: number, vehicleData: UserCarReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
      throw new Error('차량 정보 수정에 실패했습니다.');
    }
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