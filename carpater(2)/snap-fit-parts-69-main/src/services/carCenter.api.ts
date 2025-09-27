/**
 * API 서비스 (개선된 최종본)
 * - 백엔드 컨트롤러와 1:1로 매칭하여 누락된 API 함수들 모두 추가
 * - API 경로를 백엔드 컨트롤러 기준으로 통일하여 오류 수정
 * - 타입 정의를 명확하게 하여 프론트엔드-백엔드 데이터 불일치 문제 해결
 */

// =================================================================
//  API 타입 정의 (Interfaces)
// =================================================================
export interface QuoteRequestResDTO { requestId: number; requestDetails: string; address: string; createdAt: string; customerName: string; customerPhone: string; carModel: string; carYear: number; preferredDate: string; status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; imageUrls: string[]; }
export interface CarCenterRegisterRequest { centerId: string; password: string; centerName: string; address: string; phoneNumber: string; businessRegistrationNumber: string; openingHours: string; description?: string; }
export interface CarCenterUpdateRequest { centerName?: string; address?: string; phoneNumber?: string; openingHours?: string; description?: string; }
export interface CarCenterResponse { id?: string; centerId: string; centerName: string; businessRegistrationNumber: string; address: string; phoneNumber: string; status: 'PENDING' | 'ACTIVE'; description?: string; openingHours?: string; latitude?: number; longitude?: number; }
export interface ReservationReqDTO { customerName: string; customerPhone: string; carInfo: string; reservationDate: string; requestDetails?: string; }
export interface ReservationResDTO { reservationId: number; centerId: string; customerName: string; customerPhone: string; carInfo: string; reservationDate: string; requestDetails?: string; }
export interface UsedPartReqDTO { partName: string; description: string; price: number; category: string; compatibleCarModel: string; }
export interface UsedPartResDTO { partId: number; centerId: string; partName: string; description: string; price: number; category: string; compatibleCarModel: string; createdAt: string; imageUrls: string[]; centerPhoneNumber: string; }
export interface EstimateItemReqDTO { itemName: string; price: number; requiredHours: number; partType: string; }
export interface EstimateItemResDTO { itemId: number; itemName: string; price: number; requiredHours: number; partType: string; }
export interface EstimateReqDTO { requestId: number; estimatedCost: number; details: string; estimateItems: EstimateItemReqDTO[]; }
export interface EstimateResDTO { estimateId: number; requestId: number; estimatedCost: number; details: string; createdAt: string; estimateItems: EstimateItemResDTO[]; status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'; customerName: string; carModel: string; carYear: number; }
export interface Review { reviewId: number; centerName: string; writerName: string; rating: number; content: string; createdAt: string; reply?: string; }
export interface ReviewReplyReqDTO { reviewId: number; content: string; }
export interface ReviewReplyResDTO { replyId: number; reviewId: number; centerName: string; content: string; createdAt: string; }
export interface ReviewReportReqDTO { reviewId: number; reason: string; content: string; }
export interface ReviewReportResDTO { reportId: number; reviewId: number; reviewContent: string; reviewRating: number; reviewCreatedAt: string; reportingCenterId: string; reportingCenterName: string; reason: string; content: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; createdAt: string; }

// =================================================================
//  API 서비스 로직
// =================================================================

const API_BASE_URL = '/api';

class BaseApiService {
  private getHeaders(isMultipart: boolean = false): Record<string, string> {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
  protected async request<T>(method: string, url: string, body?: any, isMultipart: boolean = false): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: this.getHeaders(isMultipart),
      body: isMultipart ? body : JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류가 발생했습니다.' }));
      throw new Error(errorData.message || 'API 요청에 실패했습니다.');
    }
    if (response.status === 204) { return null as T; }
    return response.json();
  }
}

class CarCenterApiService extends BaseApiService {

  // =================================================================
  //  1. 카센터 계정 및 정보 관리 API
  // =================================================================
  register(data: CarCenterRegisterRequest): Promise<CarCenterResponse> {
    return this.request('POST', '/car-centers/register', data);
  }
  getMyCenterInfo(): Promise<CarCenterResponse> {
    return this.request('GET', '/car-centers/my-info');
  }
  updateMyInfo(data: CarCenterUpdateRequest): Promise<CarCenterResponse> {
    return this.request('PUT', '/car-centers/my-info', data);
  }
  checkDuplicate(type: 'id' | 'businessNumber', value: string): Promise<{ isDuplicate: boolean; message: string }> {
    return this.request('GET', `/car-centers/check-duplicate?type=${type}&value=${encodeURIComponent(value)}`);
  }
  deleteCarCenter(centerId: string): Promise<void> {
    return this.request('DELETE', `/car-centers/${centerId}`);
  }

  // =================================================================
  //  2. 카센터 검색 및 조회 (고객용) API
  // =================================================================
  searchCenters(params: { category?: string; district?: string; keyword?: string; sort?: string; }): Promise<CarCenterResponse[]> {
    const query = new URLSearchParams(params as Record<string, string>);
    // ✅ [수정] 백엔드 경로('/api/car-centers')와 일치시킴
    return this.request('GET', `/car-centers?${query.toString()}`);
  }
  getCarCenterById(centerId: string): Promise<CarCenterResponse> {
    // ✅ [수정] 백엔드 경로와 일치시킴
    return this.request('GET', `/car-centers/${centerId}`);
  }
  
  // =================================================================
  //  3. 예약 관리 API
  // =================================================================
  getMyReservations(): Promise<ReservationResDTO[]> {
    return this.request('GET', '/car-centers/reservations/my');
  }
  createReservation(data: ReservationReqDTO): Promise<ReservationResDTO> {
    return this.request('POST', '/car-centers/reservations', data);
  }
  updateReservation(reservationId: number, data: ReservationReqDTO): Promise<ReservationResDTO> {
    return this.request('PUT', `/car-centers/reservations/${reservationId}`, data);
  }
  deleteReservation(reservationId: number): Promise<void> {
    return this.request('DELETE', `/car-centers/reservations/${reservationId}`);
  }
  getTodayReservationCount(): Promise<number> {
    return this.request('GET', '/car-centers/today-count');
  }

  // =================================================================
  //  4. 리뷰 답변 및 신고 API
  // =================================================================
  getMyReviews(): Promise<Review[]> {
    return this.request('GET', '/car-centers/me/reviews');
  }
  createReviewReply(data: ReviewReplyReqDTO): Promise<ReviewReplyResDTO> {
    return this.request('POST', '/car-centers/replies', data);
  }
  // ✅ [누락된 기능 추가] 리뷰 답변 수정
  updateReviewReply(replyId: number, data: ReviewReplyReqDTO): Promise<ReviewReplyResDTO> {
    return this.request('PUT', `/car-centers/replies/${replyId}`, data);
  }
  // ✅ [누락된 기능 추가] 리뷰 답변 삭제
  deleteReviewReply(replyId: number): Promise<void> {
    return this.request('DELETE', `/car-centers/replies/${replyId}`);
  }
  // ✅ [누락된 기능 추가] 리뷰 신고
  createReviewReport(data: ReviewReportReqDTO): Promise<ReviewReportResDTO> {
    return this.request('POST', `/car-centers/reports`, data);
  }
  
  // ✅ [수정] 특정 카센터의 리뷰 목록 조회 API 경로를 실제 컨트롤러와 일치시킵니다.
  getReviewsByCenterId(centerId: string): Promise<Review[]> {
    // 기존: return this.request('GET', `/reviews/center/${centerId}`);
    // 변경:
    return this.request('GET', `/car-centers/${centerId}/reviews`);
  }

  // =================================================================
  //  5. 중고 부품 관리 API
  // =================================================================
  getMyUsedParts(): Promise<UsedPartResDTO[]> {
    return this.request('GET', '/car-centers/me/used-parts');
  }
  createUsedPart(partData: UsedPartReqDTO, images: File[]): Promise<UsedPartResDTO> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(partData)], { type: "application/json" }));
    images.forEach((image) => formData.append('images', image));
    return this.request('POST', '/car-centers/used-parts', formData, true);
  }
  // ✅ [누락된 기능 추가] 중고 부품 상세 정보 조회
  getUsedPartDetails(partId: number): Promise<UsedPartResDTO> {
    return this.request('GET', `/car-centers/used-parts/${partId}`);
  }
  // ✅ [누락된 기능 추가] 중고 부품 정보 수정
  updateUsedPart(partId: number, partData: UsedPartReqDTO, newImages: File[]): Promise<UsedPartResDTO> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(partData)], { type: "application/json" }));
    newImages.forEach((image) => formData.append('images', image));
    return this.request('PUT', `/car-centers/used-parts/${partId}`, formData, true);
  }
  deleteUsedPart(partId: number): Promise<void> {
    return this.request('DELETE', `/car-centers/used-parts/${partId}`);
  }
  searchParts(query: string): Promise<UsedPartResDTO[]> {
    if (!query.trim()) { return Promise.resolve([]); }
    return this.request('GET', `/car-centers/parts/search?query=${encodeURIComponent(query)}`);
  }

  // =================================================================
  //  6. 견적 요청/견적서 관리 API
  // =================================================================
  getQuoteRequests(): Promise<QuoteRequestResDTO[]> {
    return this.request('GET', `/car-centers/quote-requests`);
  }
  submitEstimate(data: EstimateReqDTO): Promise<EstimateResDTO> {
    return this.request('POST', '/estimates/', data);
  }
  getMyEstimates(): Promise<EstimateResDTO[]> {
    return this.request('GET', '/estimates/my-estimates');
  }
  getEstimateDetails(estimateId: number): Promise<EstimateResDTO> {
    return this.request('GET', `/estimates/${estimateId}`);
  }
  updateEstimate(estimateId: number, data: EstimateReqDTO): Promise<EstimateResDTO> {
    return this.request('PUT', `/estimates/${estimateId}`, data);
  }
  deleteEstimate(estimateId: number): Promise<void> {
    return this.request('DELETE', `/estimates/${estimateId}`);
  }
}

export default new CarCenterApiService();
