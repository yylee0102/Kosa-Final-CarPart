// 카센터 통합 API 서비스 - 모든 카센터 관련 기능 통합
const API_BASE_URL = '/api';



// ✅ [수정] 백엔드 QuoteRequestResDTO.java 와 완전히 동일한 구조로 변경합니다.
export interface QuoteRequestResDTO {
  requestId: number;
  requestDetails: string;
  address: string;
  createdAt: string; // LocalDateTime은 string으로 변환되어 넘어옵니다.
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: number;
  preferredDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; // status는 구체적인 타입으로 유지하는 것이 좋습니다.
  imageUrls: string[]; // ✅ 객체 배열이 아닌, 문자열 배열입니다.
}

// ==================== 카센터 기본 정보 타입 ====================




export interface CarCenterRegisterRequest {
  centerId: string;
  password: string;
  centerName: string;
  address: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  openingHours: string;
  description?: string;
}

export interface CarCenterUpdateRequest {
  centerName?: string;
  address?: string;
  phoneNumber?: string;
  openingHours?: string;
  description?: string;
}

// ✅ [수정됨] 백엔드 CarCenter.java 엔티티와 필드명을 일치시켰습니다.
export interface CarCenterResponse {
  centerId: string;
  centerName: string;
  businessRegistrationNumber: string; // 'businessNumber' -> 'businessRegistrationNumber'
  address: string;
  phoneNumber: string; // 'phone' -> 'phoneNumber'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // 'isApproved' -> 'status' (Enum 타입)
  description?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  // rating, totalReviews 등은 별도의 API로 조회하거나 백엔드 DTO에 추가해야 합니다.
}

// ==================== 예약 관련 타입 ====================
// ✅ [수정됨] 백엔드 Reservation.java 엔티티를 기반으로 재작성되었습니다.
export interface ReservationReqDTO {
  customerName: string;
  customerPhone: string;
  carInfo: string;
  reservationDate: string; // LocalDateTime은 string (ISO 형식)으로 전송 (e.g., "2025-09-26T10:00:00")
  requestDetails?: string;
}

// ✅ [수정됨] 백엔드 Reservation.java 엔티티를 기반으로 재작성되었습니다.
export interface ReservationResDTO {
  reservationId: number;
  centerId: string;
  customerName: string;
  customerPhone: string;
  carInfo: string;
  reservationDate: string;
  requestDetails?: string;
}

// ==================== 중고부품 관련 타입 ====================
export interface UsedPartReqDTO {
  partName: string;
  description: string;
  price: number;
  category: string;
  compatibleCarModel: string;
}

export interface UsedPartResDTO {
  partId: number;
  centerId: string;
  partName: string;
  description: string;
  price: number;
  category: string;
  compatibleCarModel: string;
  createdAt: string;
  imageUrls: string[];
}

// ==================== 견적 관련 타입 ====================
// Estimate.java, EstimateItem.java과 일치하여 수정이 필요 없습니다.
export interface EstimateItemReqDTO {
  itemName: string;
  price: number;
  requiredHours: number;
  partType: string;
}

export interface EstimateItemResDTO {
  itemId: number;
  itemName: string;
  price: number;
  requiredHours: number;
  partType: string;
}

export interface EstimateReqDTO {
  requestId: number;
  estimatedCost: number;
  details: string;
  estimateItems: EstimateItemReqDTO[];
}

export interface EstimateResDTO {
  estimateId: number;
  requestId: number;
  estimatedCost: number;
  details: string;
  createdAt: string;
  estimateItems: EstimateItemResDTO[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}



// ==================== 리뷰 관련 타입 ====================
// ReviewReply.java, ReviewReport.java과 일치하여 큰 수정이 필요 없습니다.
export interface Review {
  reviewId: number;
  centerName: string;
  writerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReviewReplyReqDTO {
  reviewId: number;
  content: string;
}

export interface ReviewReplyResDTO {
  replyId: number;
  reviewId: number;
  centerName: string; // 백엔드에서 CarCenter 정보를 조합하여 제공
  content: string;
  createdAt: string;
}

export interface ReviewReportReqDTO {
  reviewId: number;
  reason: string;
  content: string;
}

export interface ReviewReportResDTO {
  reportId: number;
  reviewId: number;
  reviewContent: string;
  reviewRating: number;
  reviewCreatedAt: string;
  reportingCenterId: string;
  reportingCenterName: string;
  reason: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

// ==================== 카센터 통합 API 서비스 ====================
class CarCenterApiService {
private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

private getMultipartHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
      throw new Error(errorData.message || 'API 요청에 실패했습니다.');
    }
    if (response.status === 204) {
        return Promise.resolve(null as T);
    }
    return response.json();
  }
  
  // ==================== 카센터 회원가입 및 기본 정보 ====================
  async register(registerData: CarCenterRegisterRequest): Promise<CarCenterResponse> {
    const response = await fetch(`${API_BASE_URL}/car-centers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });
    return this.handleResponse<CarCenterResponse>(response);
  }

  // ✅ [수정됨] type 파라미터 값을 'businessRegistrationNumber'로 명확하게 변경했습니다.
  async checkDuplicate(type: 'id' | 'businessRegistrationNumber', value: string): Promise<{ isDuplicate: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/car-centers/check-duplicate?type=${type}&value=${encodeURIComponent(value)}`);
    return this.handleResponse(response);
  }
  
  async updateMyInfo(updateData: CarCenterUpdateRequest): Promise<CarCenterResponse> {
    const response = await fetch(`${API_BASE_URL}/car-centers/my-info`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
    });
    return this.handleResponse<CarCenterResponse>(response);
  }

  async getCarCenterById(centerId: string): Promise<CarCenterResponse> {
    const response = await fetch(`${API_BASE_URL}/car-centers/${centerId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<CarCenterResponse>(response);
  }

  async deleteCarCenter(centerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/car-centers/${centerId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }


  // ==================== 예약 관리 ====================
  async getMyReservations(): Promise<ReservationResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/car-centers/reservations/my`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ReservationResDTO[]>(response);
  }

  async createReservation(reservation: ReservationReqDTO): Promise<ReservationResDTO> {
    const response = await fetch(`${API_BASE_URL}/car-centers/reservations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservation),
    });
    return this.handleResponse<ReservationResDTO>(response);
  }
  
  async deleteReservation(reservationId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/car-centers/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  async getTodayReservationCount(): Promise<number> {
      const response = await fetch(`${API_BASE_URL}/car-centers/today-count`, {
          headers: this.getAuthHeaders(),
      });
      return this.handleResponse<number>(response);
  }

  async updateReservation(reservationId: number, reservationData: ReservationReqDTO): Promise<ReservationResDTO> {
    const response = await fetch(`${API_BASE_URL}/car-centers/reservations/${reservationId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservationData),
    });
    return this.handleResponse<ReservationResDTO>(response);
  }


  // ==================== 견적서 관리 ====================
  async getEstimateRequests(): Promise<QuoteRequestResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/estimates/requests`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<QuoteRequestResDTO[]>(response);
  }

  async submitEstimate(estimate: EstimateReqDTO): Promise<EstimateResDTO> {
    const response = await fetch(`${API_BASE_URL}/estimates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(estimate),
    });
    return this.handleResponse<EstimateResDTO>(response);
  }

  async getMyEstimates(): Promise<EstimateResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/estimates/My-estimates`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<EstimateResDTO[]>(response);
  }

  async updateEstimate(estimateId: number, estimate: EstimateReqDTO): Promise<EstimateResDTO> {
    const response = await fetch(`${API_BASE_URL}/estimates/${estimateId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(estimate),
    });
    return this.handleResponse<EstimateResDTO>(response);
  }

  async getEstimateDetails(estimateId: number): Promise<EstimateResDTO> {
    const response = await fetch(`${API_BASE_URL}/estimates/${estimateId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<EstimateResDTO>(response);
  }

  async deleteEstimate(estimateId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/estimates/${estimateId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }


  // ==================== 중고부품 관리 ====================
  async getMyUsedParts(): Promise<UsedPartResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/car-centers/me/used-parts`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UsedPartResDTO[]>(response);
  }

  async createUsedPart(partData: UsedPartReqDTO, images: File[]): Promise<UsedPartResDTO> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(partData)], { type: "application/json" }));
    images.forEach((image) => formData.append('images', image));
    const response = await fetch(`${API_BASE_URL}/car-centers/used-parts`, {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
    return this.handleResponse<UsedPartResDTO>(response);
  }
  
  async updateUsedPart(partId: number, partData: UsedPartReqDTO, newImages?: File[]): Promise<UsedPartResDTO> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(partData)], { type: "application/json" }));
    if (newImages) {
        newImages.forEach(image => formData.append('images', image));
    }
    const response = await fetch(`${API_BASE_URL}/car-centers/used-parts/${partId}`, {
        method: 'PUT',
        headers: this.getMultipartHeaders(),
        body: formData,
    });
    return this.handleResponse<UsedPartResDTO>(response);
  }

  async deleteUsedPart(partId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/car-centers/used-parts/${partId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  async getUsedPartDetails(partId: number): Promise<UsedPartResDTO> {
    const response = await fetch(`${API_BASE_URL}/car-centers/used-parts/${partId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<UsedPartResDTO>(response);
  }


  // ==================== 리뷰 답변 및 신고 관리 ====================
  /**
   * [🚨 백엔드 구현 필요] 내 카센터에 달린 리뷰 목록 조회
   * GET /api/car-centers/me/reviews
   */
  async getMyReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/car-centers/me/reviews`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Review[]>(response);
  }
  
  async createReviewReply(reply: ReviewReplyReqDTO): Promise<ReviewReplyResDTO> {
    const response = await fetch(`${API_BASE_URL}/car-centers/replies`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reply),
    });
    return this.handleResponse<ReviewReplyResDTO>(response);
  }

  async reportReview(report: ReviewReportReqDTO): Promise<ReviewReportResDTO> {
    const response = await fetch(`${API_BASE_URL}/car-centers/reports`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(report),
    });
    return this.handleResponse<ReviewReportResDTO>(response);
  }
  
  async updateReviewReply(replyId: number, replyData: ReviewReplyReqDTO): Promise<ReviewReplyResDTO> {
    const response = await fetch(`${API_BASE_URL}/car-centers/replies/${replyId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(replyData),
    });
    return this.handleResponse<ReviewReplyResDTO>(response);
  }

  async deleteReviewReply(replyId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/car-centers/replies/${replyId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  /**
   * ✅ [수정됨] 이제 '/api/car-centers/quote-requests'를 호출합니다.
   * 함수 이름도 getQuoteRequests로 변경하여 명확하게 합니다.
   */
  async getQuoteRequests(): Promise<QuoteRequestResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/car-centers/quote-requests`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<QuoteRequestResDTO[]>(response);
  }

/**
   * [신규] 내 카센터 정보 상세 조회
   * GET /api/car-centers/my-info
   */
  async getMyCenterInfo(): Promise<CarCenterResponse> {
    const response = await fetch(`${API_BASE_URL}/car-centers/my-info`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<CarCenterResponse>(response);
  }

}

export default new CarCenterApiService();