// src/services/admin.api.ts
// ✅ 제공된 Java 백엔드 코드와 100% 동기화된 최종 버전

const API_BASE_URL = "/api";

/* ==================== 타입 정의 (DTO) ==================== */

// --- 요청(Request) DTOs ---
// ✅ 공지사항 생성/수정 시 백엔드 엔티티 구조에 맞춰 admin 객체를 포함
export interface AnnouncementReqDTO {
   title: string;
  content: string;
  admin?: {
    adminId: string; // 👈 id -> adminId, number -> string
  };
}

// --- 응답(Response) DTOs ---
export interface CarCenterApprovalResDTO {
  approvalId: number;
  requestedAt: string;
  centerId: string;
  centerName: string;
  businessNumber?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  ownerName?: string;
  description?: string;
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

// ✅ 백엔드가 전체 Announcement 엔티티를 반환하므로, 프론트에서도 동일한 구조로 받음
export interface AnnouncementResDTO {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  admin?: {
    id: number;
    name: string;
    // 기타 Admin 정보...
  };
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
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

/* ==================== 공통 유틸/래퍼 ==================== */
function buildAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("authToken") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function http<T = unknown>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: "An unknown error occurred" }));
    console.error("API Error:", errorBody);
    throw new Error(`[${res.status}] ${res.statusText} :: ${JSON.stringify(errorBody)}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return {} as T;
  }

  return res.json() as T;
}

const api = (path: string) => `${API_BASE_URL}${path}`;

/* ==================== 관리자 API 서비스 ==================== */
class AdminApiService {
  /* ----- 통계 ----- */
  async getGenderStats(): Promise<Record<string, number>> {
    return http(api(`/admin/stats/gender`), { headers: buildAuthHeaders() });
  }
  async getAgeStats(): Promise<Record<string, number>> {
    return http(api(`/admin/stats/age`), { headers: buildAuthHeaders() });
  }
  async getUserCount(): Promise<number> {
    return http<number>(api(`/admin/stats/users/count`), { headers: buildAuthHeaders() });
  }
  async getCenterCount(): Promise<number> {
    return http<number>(api(`/admin/stats/centers/count`), { headers: buildAuthHeaders() });
  }
  async getPendingApprovalsCount(): Promise<number> {
    return http<number>(api(`/admin/stats/approvals/pending/count`), { headers: buildAuthHeaders() });
  }
  async getReviewReportsCount(): Promise<number> {
    return http<number>(api(`/admin/stats/reports/reviews/count`), { headers: buildAuthHeaders() });
  }

  /* ----- 카센터 승인 관리 ----- */
  async getPendingApprovals(): Promise<CarCenterApprovalResDTO[]> {
    return http<CarCenterApprovalResDTO[]>(api(`/admin/approvals/pending`), { headers: buildAuthHeaders() });
  }
  async getApprovalDetail(approvalId: number): Promise<CarCenterApprovalResDTO> {
    return http<CarCenterApprovalResDTO>(api(`/admin/approvals/${approvalId}`), { headers: buildAuthHeaders() });
  }
  async approveCenter(approvalId: number): Promise<{ message: string }> { // ✅ 반환 타입 수정
    return http(api(`/admin/approvals/${approvalId}/approve`), { method: "POST", headers: buildAuthHeaders() });
  }
  async rejectCenter(approvalId: number, reason: string): Promise<{ message: string }> { // ✅ 반환 타입 수정
    const qs = new URLSearchParams({ reason }).toString();
    return http(api(`/admin/approvals/${approvalId}?${qs}`), { method: "DELETE", headers: buildAuthHeaders() });
  }

  /* ----- CS 문의 ----- */
  async getCsInquiries(): Promise<CsInquiryResDTO[]> {
    return http<CsInquiryResDTO[]>(api(`/admin/cs`), { headers: buildAuthHeaders() });
  }
  async getCsInquiryDetail(inquiryId: number): Promise<CsInquiryResDTO> {
    return http<CsInquiryResDTO>(api(`/admin/cs/${inquiryId}`), { headers: buildAuthHeaders() });
  }
  async answerInquiry(inquiryId: number, answerContent: string): Promise<void> {
    await http<void>(api(`/admin/cs/${inquiryId}/answer`), {
      method: "PUT",
      headers: buildAuthHeaders(),
      body: JSON.stringify({ answerContent }),
    });
  }

  /* ----- 공지사항 ----- */
  async getAnnouncements(): Promise<AnnouncementResDTO[]> {
    return http<AnnouncementResDTO[]>(api(`/admin/announcements`), { headers: buildAuthHeaders() });
  }
  async getAnnouncementDetail(id: number): Promise<AnnouncementResDTO> {
    return http<AnnouncementResDTO>(api(`/admin/announcements/${id}`), { headers: buildAuthHeaders() });
  }
  async createAnnouncement(announcement: AnnouncementReqDTO): Promise<void> {
    await http<void>(api(`/admin/announcements`), {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(announcement),
    });
  }
  async updateAnnouncement(id: number, announcement: AnnouncementReqDTO): Promise<void> {
    await http<void>(api(`/admin/announcements/${id}`), {
      method: "PUT",
      headers: buildAuthHeaders(),
      body: JSON.stringify(announcement),
    });
  }
  async deleteAnnouncement(id: number): Promise<void> {
    await http<void>(api(`/admin/announcements/${id}`), { method: "DELETE", headers: buildAuthHeaders() });
  }

  /* ----- 리뷰 신고 ----- */
  async getReviewReports(): Promise<ReviewReportResDTO[]> {
    return http<ReviewReportResDTO[]>(api(`/admin/reports/reviews`), { headers: buildAuthHeaders() });
  }
  async getReviewReportDetail(reportId: number): Promise<ReviewReportResDTO> {
    return http<ReviewReportResDTO>(api(`/admin/reports/reviews/${reportId}`), { headers: buildAuthHeaders() });
  }
  async deleteReviewReport(reportId: number): Promise<void> {
    await http<void>(api(`/admin/reports/reviews/${reportId}`), { method: "DELETE", headers: buildAuthHeaders() });
  }
}

export default new AdminApiService();