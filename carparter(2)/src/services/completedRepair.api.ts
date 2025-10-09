// src/services/completedRepair.api.ts

// DTO 타입 정의는 동일하게 유지합니다.
export interface CompletedRepairResDTO {
  id: number;
  userId: string;
  userName: string;
  carCenterId: string;
  carCenterName: string;
  originalRequestId: number;
  originalEstimateId: number;
  finalCost: number;
  repairDetails: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  completedAt: string | null;
}

const API_BASE_URL = '/api';

// 인증 헤더 생성 헬퍼 함수
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


class CompletedRepairApiService {

  // =======================================================
  //  사용자용 API
  // =======================================================

  /**
   * (사용자용) 내 수리 완료 내역 목록 조회
   * GET /api/users/my-completed-repairs
   */
  async getMyCompletedRepairs(): Promise<CompletedRepairResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/users/my-completed-repairs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('내 수리 내역을 가져오는 데 실패했습니다.');
    }
    return response.json();
  }

  /**
   * (사용자용) 수리 내역 삭제
   * DELETE /api/users/completed-repairs/{id}
   */
  async deleteCompletedRepair(repairId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/completed-repairs/${repairId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('수리 내역 삭제에 실패했습니다.');
    }
  }

  // =======================================================
  //  카센터용 API
  // =======================================================
  
  /**
   * (카센터용) 특정 수리를 '완료' 상태로 변경 (알림은 백엔드에서 처리)
   * POST /api/completed-repairs/{repairId}/complete
   */
  async markAsCompleted(repairId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/completed-repairs/${repairId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('수리 완료 처리에 실패했습니다.');
    }
  }

  /**
   * ✅ [신규 추가] 특정 수리 내역의 상세 정보 조회
   * GET /api/completed-repairs/{id}  (백엔드에 이 API가 있다고 가정)
   */
  async getCompletedRepairDetails(repairId: number): Promise<CompletedRepairResDTO> {
    const response = await fetch(`${API_BASE_URL}/completed-repairs/${repairId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('수리 내역 상세 정보를 가져오는 데 실패했습니다.');
    }
    return response.json();
  }


  /**
   * ✅ [추가] (카센터용) 카센터의 모든 수리 내역 목록 조회
   * GET /api/car-centers/my-completed-repairs
   */
  async getCompletedRepairsForCenter(): Promise<CompletedRepairResDTO[]> {
    const response = await fetch(`${API_BASE_URL}/car-centers/my-completed-repairs`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('카센터의 수리 내역을 가져오는 데 실패했습니다.');
    }
    return response.json();
  }

}

export default new CompletedRepairApiService();