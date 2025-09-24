import axios from 'axios';

// axios 인스턴스 생성 및 기본 URL 설정
const apiClient = axios.create({
    baseURL: `http://localhost:9000/api`
});

// 모든 요청에 JWT 토큰을 자동으로 추가하는 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        // localStorage에서 토큰을 가져옵니다.
        const token = localStorage.getItem('authToken');
        if (token) {
            // 'headers'로 오타 수정 및 Bearer와 토큰 사이 공백 추가
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;