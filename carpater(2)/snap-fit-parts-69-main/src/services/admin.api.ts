// src/services/admin.api.ts
// 관리자 API 서비스 - 백엔드 엔티티/엔드포인트에 맞춰 정리 (튼튼한 http 래퍼 포함)

const API_BASE_URL = "/api";

/* ==================== 타입 정의 ==================== */
export interface CarCenterApprovalReqDTO {
  centerId: string;
  reason?: string;
}

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
  status?: string;
  userId?: string;
}

export interface AnnouncementReqDTO {
  title: string;
  content: string;
}

export interface AnnouncementResDTO {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewReportReqDTO {
  reviewId: number;
  centerId: string;
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
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

/* ==================== 공통 유틸/래퍼 ==================== */
function buildAuthHeaders(extra?: HeadersInit): HeadersInit {
  const raw = localStorage.getItem("authToken") || "";
  const hasBearer = raw.toLowerCase().startsWith("bearer ");
  const token = raw ? (hasBearer ? raw : `Bearer ${raw}`) : "";

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
    ...(extra || {}),
  };
}

async function http<T = unknown>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");

  if (!res.ok) {
    // 에러 본문을 최대한 읽어서 메시지에 포함
    const body = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
    const detail =
      typeof body === "string" ? body.slice(0, 300) : JSON.stringify(body);
    throw new Error(`[${res.status}] ${res.statusText} ${detail ? ":: " + detail : ""}`.trim());
  }

  if (!isJson) {
    const text = await res.text().catch(() => "");
    // Vite 프록시 미설정/경로 오타일 때 대부분 HTML이 옴
    throw new SyntaxError(`Expected JSON but received non-JSON response. Snippet: ${text.slice(0, 160)}...`);
  }

  return (await res.json()) as T;
}

const api = (path: string) => `${API_BASE_URL}${path}`;

/* ==================== 관리자 API ==================== */
class AdminApiService {
  /* ----- 통계 ----- */
  async getUserCount(): Promise<number> {
    return http<number>(api(`/admin/stats/users/count`), {
      headers: buildAuthHeaders(),
    });
  }

  async getCenterCount(): Promise<number> {
    return http<number>(api(`/admin/stats/centers/count`), {
      headers: buildAuthHeaders(),
    });
  }

  async getPendingApprovalsCount(): Promise<number> {
    return http<number>(api(`/admin/stats/approvals/pending/count`), {
      headers: buildAuthHeaders(),
    });
  }

  async getReviewReportsCount(): Promise<number> {
    return http<number>(api(`/admin/stats/reports/reviews/count`), {
      headers: buildAuthHeaders(),
    });
  }

  async getGenderStats(): Promise<{ male: number; female: number }> {
    return http(api(`/admin/stats/gender`), {
      headers: buildAuthHeaders(),
    });
  }

 async getAgeStats(): Promise<{ [key: string]: number }> { // ✅ 수정 후
    return http(api(`/admin/stats/age`), {
      headers: buildAuthHeaders(),
    });
  }

  /* ----- 카센터 승인 관리 ----- */
  // 승인 상세 정보 조회
    async getApprovalDetail(approvalId: number): Promise<CarCenterApprovalResDTO> {
    return http<CarCenterApprovalResDTO>(api(`/admin/approvals/${approvalId}`), {
      headers: buildAuthHeaders(),
    });
  }


  // 승인 대기 목록
  async getPendingApprovals(): Promise<CarCenterApprovalResDTO[]> {
    return http<CarCenterApprovalResDTO[]>(api(`/admin/approvals/pending`), {
      headers: buildAuthHeaders(),
    });
  }

  // 승인 처리
  async approveCenter(approvalId: number): Promise<void> {
    await http<void>(api(`/admin/approvals/${approvalId}/approve`), {
      method: "POST",
      headers: buildAuthHeaders(),
    });
  }

  // 반려 처리 (백엔드가 DELETE + querystring을 기대한다는 전제 유지)
  async rejectCenter(approvalId: number, reason: string): Promise<void> {
    const qs = new URLSearchParams({ reason }).toString();
    await http<void>(api(`/admin/approvals/${approvalId}?${qs}`), {
      method: "DELETE",
      headers: buildAuthHeaders(),
    });
  }

  /* ----- CS 문의 ----- */
  async getCsInquiries(): Promise<CsInquiryResDTO[]> {
    return http<CsInquiryResDTO[]>(api(`/admin/cs`), {
      headers: buildAuthHeaders(),
    });
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
    return http<AnnouncementResDTO[]>(api(`/admin/announcements`), {
      headers: buildAuthHeaders(),
    });
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
    await http<void>(api(`/admin/announcements/${id}`), {
      method: "DELETE",
      headers: buildAuthHeaders(),
    });
  }

  /* ----- 리뷰 신고 ----- */
  async getReviewReports(): Promise<ReviewReportResDTO[]> {
    return http<ReviewReportResDTO[]>(api(`/admin/reports/reviews`), {
      headers: buildAuthHeaders(),
    });
  }

  async getReviewReportDetail(reportId: number): Promise<ReviewReportResDTO> {
    return http<ReviewReportResDTO>(api(`/admin/reports/reviews/${reportId}`), {
      headers: buildAuthHeaders(),
    });
  }

  async deleteReviewReport(reportId: number): Promise<void> {
    await http<void>(api(`/admin/reports/reviews/${reportId}`), {
      method: "DELETE",
      headers: buildAuthHeaders(),
    });
  }
}

export default new AdminApiService();
