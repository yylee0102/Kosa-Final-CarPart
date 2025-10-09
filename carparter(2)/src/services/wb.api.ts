// TODO: API 연결 시 실제 axios 인스턴스로 교체
// 현재는 더미 데이터를 반환하는 함수들

// WB (중고부품) API 서비스
export interface PartSearchParams {
  category?: string;
  q?: string; // 검색 키워드
  sort?: "latest" | "price-low" | "price-high" | "popular" | "distance";
  priceMin?: number;
  priceMax?: number;
  conditions?: string[];
  sellerTypes?: string[];
  location?: string;
  page?: number;
  limit?: number;
}

export interface Part {
  id: string;
  title: string;
  price: number;
  images: string[];
  oem?: string;
  compatible: string[];
  condition: "신품" | "중고A급" | "중고B급" | "중고C급";
  location: string;
  postedAt: string;
  views: number;
  isLiked?: boolean;
  sellerType: "개인" | "업체";
  description: string;
  seller: {
    name: string;
    phone: string;
    address: string;
    rating: number;
  };
  specifications: {
    brand: string;
    partNumber: string;
    year: string;
    model: string;
    engine: string;
  };
}

// 부품 목록 조회
export const fetchParts = async (params: PartSearchParams = {}): Promise<{ parts: Part[], total: number }> => {
  // TODO: 실제 API 호출로 교체
  // const response = await axios.get('/api/wb/parts', { params });
  // return response.data;
  
  console.log("API 호출 - 부품 목록 조회:", params);
  
  // 더미 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 500)); // API 호출 시뮬레이션
  
  const dummyParts: Part[] = [
    {
      id: "1",
      title: "현대 아반떼 2020년식 헤드라이트 좌측 (신품급)",
      price: 150000,
      images: ["/api/placeholder/300/300"],
      oem: "92101-3X000",
      compatible: ["2018-2022 아반떼", "2019-2021 셀토스"],
      condition: "중고A급",
      location: "서울 강남구",
      postedAt: "2024-09-22T10:00:00Z",
      views: 156,
      isLiked: false,
      sellerType: "개인",
      description: "2020년식 아반떼에서 분리한 헤드라이트입니다.\n사고차량이 아니며, 기능상 문제 전혀 없습니다.\n렌즈에 미세한 스크래치 있으나 야간 주행에 지장 없습니다.",
      seller: {
        name: "김철수",
        phone: "010-1234-5678",
        address: "서울 강남구 역삼동",
        rating: 4.8
      },
      specifications: {
        brand: "현대",
        partNumber: "92101-3X000",
        year: "2020",
        model: "아반떼",
        engine: "1.6 가솔린"
      }
    },
    {
      id: "2", 
      title: "기아 쏘렌토 범퍼 후면 좌측 - 무사고 차량",
      price: 80000,
      images: ["/api/placeholder/300/300"],
      compatible: ["2015-2020 쏘렌토"],
      condition: "중고B급",
      location: "경기 성남시",
      postedAt: "2024-09-21T15:30:00Z",
      views: 89,
      isLiked: true,
      sellerType: "업체",
      description: "쏘렌토 후면 범퍼입니다.\n색상: 펄 화이트\n긁힘이나 찌그러짐 없는 깨끗한 상태입니다.",
      seller: {
        name: "성남자동차부품",
        phone: "031-123-4567", 
        address: "경기 성남시 분당구",
        rating: 4.6
      },
      specifications: {
        brand: "기아",
        partNumber: "86612-C5000",
        year: "2018",
        model: "쏘렌토",
        engine: "2.2 디젤"
      }
    }
  ];

  return {
    parts: dummyParts,
    total: dummyParts.length
  };
};

// 부품 상세 조회
export const fetchPartById = async (id: string): Promise<Part | null> => {
  // TODO: 실제 API 호출로 교체
  // const response = await axios.get(`/api/wb/parts/${id}`);
  // return response.data;
  
  console.log("API 호출 - 부품 상세 조회:", id);
  
  const { parts } = await fetchParts();
  return parts.find(part => part.id === id) || null;
};

// 부품 등록
export const createPart = async (partData: Omit<Part, 'id' | 'postedAt' | 'views' | 'isLiked'>): Promise<Part> => {
  // TODO: 실제 API 호출로 교체
  // const response = await axios.post('/api/wb/parts', partData);
  // return response.data;
  
  console.log("API 호출 - 부품 등록:", partData);
  
  // 더미 응답 반환
  const newPart: Part = {
    ...partData,
    id: Date.now().toString(),
    postedAt: new Date().toISOString(),
    views: 0,
    isLiked: false
  };
  
  return newPart;
};

// 부품 찜하기/해제
export const togglePartLike = async (partId: string): Promise<{ isLiked: boolean }> => {
  // TODO: 실제 API 호출로 교체
  // const response = await axios.post(`/api/wb/parts/${partId}/like`);
  // return response.data;
  
  console.log("API 호출 - 부품 찜하기/해제:", partId);
  
  // 더미 응답 반환
  return { isLiked: Math.random() > 0.5 };
};

// 이미지 업로드
export const uploadPartImages = async (files: File[]): Promise<string[]> => {
  // TODO: 실제 이미지 업로드 API로 교체
  // const formData = new FormData();
  // files.forEach(file => formData.append('images', file));
  // const response = await axios.post('/api/wb/upload', formData);
  // return response.data.urls;
  
  console.log("API 호출 - 이미지 업로드:", files.length, "개 파일");
  
  // 더미 URL 반환
  return files.map((_, index) => `/api/placeholder/300/300?${index}`);
};