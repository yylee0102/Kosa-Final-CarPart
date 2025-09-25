// 통합 인증 API 서비스
const API_BASE_URL = '/api';

// ==================== 공통 타입 정의 ====================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  name: string;
  role: string;
  userType: string;
}

export interface UserReqDTO {
  userId: string;
  password: string;
  name: string;
  phoneNumber: string;
  ssn: string;
  marketingAgreed: boolean;
}

export interface CarCenterReqDTO {
  centerId: string;
  password: string;
  centerName: string;
  address: string;
  phoneNumber: string;
  businessRegistrationNumber: string;
  openingHours: string;
  description?: string;
}

export interface AdminReqDTO {
  adminId: string;
  password: string;
}

// ==================== 통합 인증 서비스 ====================
class AuthApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': token || '',
      'Content-Type': 'application/json',
    };
  }

  /**
   * 전화번호 인증 코드 발송
   * POST /api/auth/send-verification-code
   */
  async sendVerificationCode(phoneNumber: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      throw new Error('인증 코드 발송에 실패했습니다.');
    }
  }

  /**
   * 전화번호 인증 코드 확인
   * POST /api/auth/verify-phone
   */
  async verifyPhoneCode(phoneNumber: string, verificationCode: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, verificationCode }),
    });

    if (!response.ok) {
      throw new Error('인증 코드 확인에 실패했습니다.');
    }

    const result = await response.json();
    return result.verified;
  }

  /**
   * 통합 로그인 (모든 사용자 타입)
   * POST /api/login
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('로그인에 실패했습니다.');
    }
    
    // Authorization 헤더에서 토큰 추출
    const token = response.headers.get('Authorization');
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    return response.json();
  }

  /**
   * 일반 사용자 회원가입
   * POST /api/users/join
   */
  async userJoin(request: UserReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('회원가입에 실패했습니다.');
    }
  }

  /**
   * 카센터 회원가입
   * POST /api/car-centers/register
   */
  async carCenterRegister(request: CarCenterReqDTO): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/car-centers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('카센터 등록에 실패했습니다.');
    }
  }

  /**
   * 로그아웃
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }
}

export default new AuthApiService();