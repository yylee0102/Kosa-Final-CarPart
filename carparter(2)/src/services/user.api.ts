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

export interface ReviewReqDTO {
  centerId: string;
  rating: number;
  content: string;
  repairId?: number; // 수리 내역과 연결된 리뷰인 경우에만 포함
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

// [핵심 수정] 실제 API 응답 데이터와 필드 이름 및 타입을 모두 일치시킵니다.
export interface CompletedRepairResDTO {
  repairId: number; // ⬅️ 이름을 'repairId'로 변경
  userName: string;
  carCenterName: string;
  carCenterId: string; // ⬅️ 이 줄을 추가하세요.
  finalCost: number;
  repairDetails: string;
  completedAt: string | null; // ⬅️ null일 수도 있으므로 | null 추가
  status: 'COMPLETED' | 'IN_PROGRESS';
  carModel: string;
  licensePlate: string;
  createdAt: string;
  reviewId : number | null; // ⬅️ 리뷰가 없을 수도 있으므로 | null 추가
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

// ✅ [추가] 백엔드의 EstimateResDTO에 맞춰 Estimate 타입을 정의합니다.
// [신규 추가] EstimateItem에 대한 타입 정의
export interface EstimateItem {
  itemId: number;
  itemName: string;
  price: number;
  requiredHours: number;
  partType: string;
}

// [핵심 수정] 백엔드 EstimateResDTO.java와 필드를 100% 일치시킵니다.
export interface Estimate {
  estimateId: number;
  requestId: number;
  estimatedCost: number;
  details: string;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'; // ⬅️ status 필드 추가!
  centerName: string;
  estimateItems: EstimateItem[];
  centerId: string;
  customerName: string;
  carModel: string;
  carYear: number;
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
  // 
  
  /** [임시] 이미지 없는 견적 요청 생성 API */
async createQuoteRequest(request: QuoteRequestReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/quote-requests`, {
      method: 'POST',
      // ✅ 'Content-Type': 'application/json' 이 포함된 헤더를 사용하는지 확인
      headers: this.getAuthHeaders(), 
      // ✅ FormData가 아닌, DTO 객체를 JSON 문자열로 변환해서 보내는지 확인
      body: JSON.stringify(request),
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

    // ✅ [추가] 204 No Content 상태 코드를 먼저 확인
    if (response.status === 204) {
      return null; // 데이터가 없으면 null을 반환
    }

    if (!response.ok) {
      throw new Error('견적 요청 목록 조회에 실패했습니다.');
    }

    return response.json(); // 204가 아니면 JSON 파싱 시도
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
     * [신규 추가] ID로 특정 리뷰 상세 정보 조회
     * GET /api/users/reviews/{id}
     */
    async getReviewById(reviewId: number): Promise<ReviewResDTO> {
        const response = await fetch(`${API_BASE_URL}/users/reviews/${reviewId}`, {
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('리뷰 정보를 불러오는 데 실패했습니다.');
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

  // ▼▼▼ 3. 리뷰 삭제 API 함수를 추가하세요 ▼▼▼
    async deleteReview(reviewId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/users/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('리뷰 삭제에 실패했습니다.');
        }
    }

    /**
   * [신규 추가] 특정 리뷰 수정
   * PUT /api/users/reviews/{id}
   */
  async updateReview(reviewId: number, reviewData: ReviewReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/reviews/${reviewId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('리뷰 수정에 실패했습니다.');
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
    // 1. 서버로부터 받은 원본 데이터를 임시로 저장합니다.
  const rawData: any[] = await response.json();

  // 2. map 함수를 사용해 각 항목의 'id'를 'repairId'로 이름을 바꿔서 새로운 배열을 만듭니다.
  const formattedData = rawData.map(item => {
    return {
      ...item, // ⬅️ id를 제외한 나머지 모든 속성은 그대로 복사
      repairId: item.id // ⬅️ repairId라는 새로운 속성에 id 값을 할당
    };
  });

  return formattedData; // ⬅️ 최종적으로 변환된 데이터를 반환

    // return response.json();
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

  async acceptEstimate(estimateId: number): Promise<void> {
    // UserController에 @PutMapping("/estimates/{estimateId}/accept") 엔드포인트가 있다.
    const response = await fetch(`${API_BASE_URL}/users/estimates/${estimateId}/accept`, {
      method: 'PUT', // 상태를 변경하므로 PUT 메서드 사용
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error('견적 확정에 실패했습니다.');
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