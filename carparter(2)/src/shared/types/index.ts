// 공통 타입 정의

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: "개인" | "사장님" | "관리자";
  profileImage?: string;
  rating?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarCenter {
  centerId: string;
  centerName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phoneNumber: string;
  description?: string;
  businessRegistrationNumber: string;
  openingHours: string;
  status: 'PENDING' | 'ACTIVE';
}

export interface Estimate {
  estimateId: number;
  estimatedCost: number;
  details: string;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "이용방법" | "결제" | "부품" | "센터" | "기타";
  isPopular: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CsInquiry {
  inquiryId: number;
  userName: string;
  title: string;
  questionContent: string;
  answerContent?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface ChatRoom {
  roomId: number;
  updatedAt: string;
  user: {
    userId: string;
    name: string;
  };
  carCenter: {
    centerId: string;
    centerName: string;
  };
}

export interface CompletedRepair {
  repairId: number;
  repairDetail: string;
  completionDate: string;
  userId: string;
  userName: string;
  centerId: string;
  centerName: string;
}

export interface Admin {
  adminId: string;
  name: string;
}

export interface CarCenterApproval {
  approvalId: number;
  requestedAt: string;
  centerId: string;
  centerName: string;
  reason?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 검색 관련 타입
export interface SearchFilters {
  keyword?: string;
  category?: string;
  location?: string;
  priceRange?: [number, number];
  conditions?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 이미지 업로드 관련
export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// ===== 견적 관련 타입 =====
export interface EstimateResDTO {
  estimateId: number;
  quoteRequestId: number;
  centerId: number;
  centerName: string;
  estimatedCost: number;
  details: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
  createdAt: string;
  estimateItems: EstimateItemResDTO[];
}

export interface EstimateItemResDTO {
  itemId: number;
  itemName: string;
  price: number;
  requiredHours: number;
  partType: string;
}

export interface QuoteRequestResDTO {
  requestId: number;
  userId: number;
  userCarId: number;
  requestDetails: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  requestImages: RequestImageResDTO[];
}

export interface RequestImageResDTO {
  imageId: number;
  imageUrl: string;
}

export interface ReservationResDTO {
  reservationId: number;
  centerId: number;
  customerName: string;
  customerPhone: string;
  carInfo: string;
  reservationDate: string;
  requestDetails?: string;
}

export interface ReviewResDTO {
  reviewId: number;
  centerId: number;
  userId: number;
  completedRepairId?: number;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReviewReplyResDTO {
  replyId: number;
  reviewId: number;
  centerId: number;
  content: string;
  createdAt: string;
}

export interface ReviewReportResDTO {
  reportId: number;
  // 신고 대상 리뷰 정보 (JOIN 결과)
  reviewId: number;
  reviewContent: string;
  reviewRating: number;
  reviewCreatedAt: string;
  // 신고한 카센터 정보 (JOIN 결과)  
  reportingCenterId: string;
  reportingCenterName: string;
  // 신고 정보
  reason: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

// ===== 기존 DTO 타입들 =====
export interface CarCenterApprovalResDTO {
  approvalId: number;
  requestedAt: string;
  centerId: string;
  centerName: string;
  businessNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
}

export interface CsInquiryResDTO {
  inquiryId: number;
  userName: string;
  title: string;
  questionContent: string;
  answerContent?: string;
  answeredAt?: string;
  createdAt: string;
  status?: string;
  userId?: string;
}

export interface AnnouncementResDTO {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface AnnouncementCreateReqDTO {
  title: string;
  content: string;
}

export interface AnnouncementUpdateReqDTO {
  title?: string;
  content?: string;
}

// ===== 새로운 엔티티 타입 추가 =====
export interface UsedPartResDTO {
  partId: number;
  centerId: string;
  centerName: string;
  partName: string;
  description: string;
  price: number;
  category: string;
  compatibleCarModel: string;
  createdAt: string;
  images: UsedPartImageResDTO[];
}

export interface UsedPartImageResDTO {
  imageId: number;
  imageUrl: string;
}

export interface UsedPartCreateReqDTO {
  partName: string;
  description: string;
  price: number;
  category: string;
  compatibleCarModel: string;
}

export interface UserResDTO {
  userId: string;
  name: string;
  phoneNumber: string;
  ssn: string;
  marketingAgreed: boolean;
  userCars: UserCarResDTO[];
}

export interface UserCarResDTO {
  userCarId: number;
  carModel: string;
  carNumber: string;
  modelYear: number;
  createdAt: string;
}