// 견적서 API 서비스 - EstimateController-2.java 연동
const API_BASE_URL = '/api';

export interface EstimateRequest {
  requestId: number;
  partName: string;
  estimatedPrice: number;
  description: string;
  estimatedDate: string;
  validUntil: string;
}

export interface EstimateResponse {
  estimateId: number;
  centerId: string;
  centerName: string;
  partName: string;
  estimatedPrice: number;
  description: string;
  estimatedDate: string;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  validUntil: string;
}

class EstimatesApiService {
  // 1. 견적서 제출 API (카센터용)
  async submitEstimate(estimateData: EstimateRequest): Promise<EstimateResponse> {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(estimateData),
    });

    if (!response.ok) {
      throw new Error('견적서 제출에 실패했습니다.');
    }

    return response.json();
  }

  // 2. 내가 제출한 견적서 목록 조회 API (카센터용)
  async getMyEstimates(): Promise<EstimateResponse[]> {
    const response = await fetch(`${API_BASE_URL}/My-estimates`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('견적서 목록 조회에 실패했습니다.');
    }

    return response.json();
  }

  // 3. 견적서 수정 API (카센터용)
  async updateEstimate(estimateId: number, estimateData: Partial<EstimateRequest>): Promise<EstimateResponse> {
    const response = await fetch(`${API_BASE_URL}/${estimateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(estimateData),
    });

    if (!response.ok) {
      throw new Error('견적서 수정에 실패했습니다.');
    }

    return response.json();
  }

  // 4. 특정 견적서 상세 조회 API
  async getEstimateDetails(estimateId: number): Promise<EstimateResponse> {
    const response = await fetch(`${API_BASE_URL}/${estimateId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('견적서 상세 조회에 실패했습니다.');
    }

    return response.json();
  }

  // 5. 견적서 삭제 API (카센터용)
  async deleteEstimate(estimateId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${estimateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('견적서 삭제에 실패했습니다.');
    }
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}

export default new EstimatesApiService();