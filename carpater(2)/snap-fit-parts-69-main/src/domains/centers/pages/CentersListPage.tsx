import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Star, Clock, Filter, Search, Navigation } from "lucide-react";
import { formatKRW } from "@/shared/utils/format";
import { useModal } from "@/shared/hooks/useModal";
import CenterMapModal from "../modals/CenterMapModal";

interface CarCenter {
  centerId: string;
  centerName: string;
  businessNumber: string;
  address: string;
  phone: string;
  rating?: number;
  totalReviews?: number;
  isApproved: boolean;
  createdAt: string;
}

const serviceCategories = [
  "전체", "엔진 수리", "브레이크 정비", "타이어 교체", 
  "에어컨 수리", "전기계통", "차체 수리", "내부 수리", "정기 점검"
];

const districts = [
  "전체", "강남구", "강동구", "강북구", "강서구", "관악구", 
  "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구",
  "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구",
  "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
];

export default function CentersListPage() {
  const navigate = useNavigate();
  const [centers, setCenters] = useState<CarCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [sortBy, setSortBy] = useState("distance");
  
  const mapModal = useModal();

  useEffect(() => {
    // API 연결: 카센터 목록 조회
    // GET /api/centers?category=&district=&keyword=&sort=
    fetchCenters();
  }, [selectedCategory, selectedDistrict, sortBy]);

  const fetchCenters = async () => {
    try {
      setLoading(true);

      // 임시 데이터 (실제로는 API 호출)
      const mockCenters: CarCenter[] = [
        {
          centerId: "1",
          centerName: "믿음 자동차 정비소",
          businessNumber: "123-45-67890",
          address: "서울시 강남구 테헤란로 123",
          phone: "02-1234-5678",
          rating: 4.8,
          totalReviews: 127,
          isApproved: true,
          createdAt: "2024-01-01T00:00:00Z"
        },
        {
          centerId: "2",
          centerName: "전문 카서비스",
          businessNumber: "234-56-78901",
          address: "서울시 강남구 역삼동 456",
          phone: "02-2345-6789",
          rating: 4.6,
          totalReviews: 89,
          isApproved: true,
          createdAt: "2024-01-15T00:00:00Z"
        },
        {
          centerId: "3",
          centerName: "신속 오토센터",
          businessNumber: "345-67-89012",
          address: "서울시 서초구 서초대로 789",
          phone: "02-3456-7890",
          rating: 4.9,
          totalReviews: 203,
          isApproved: true,
          createdAt: "2024-02-01T00:00:00Z"
        }
      ];

      // 필터링 적용
      let filteredCenters = mockCenters;
      
      if (searchKeyword.trim()) {
        filteredCenters = filteredCenters.filter(center =>
          center.centerName.includes(searchKeyword) || 
          center.address.includes(searchKeyword)
        );
      }

      // 정렬 적용 (승인된 카센터만)
      filteredCenters = filteredCenters.filter(center => center.isApproved);
      
      switch (sortBy) {
        case "rating":
          filteredCenters.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "review":
          filteredCenters.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
          break;
        case "name":
          filteredCenters.sort((a, b) => a.centerName.localeCompare(b.centerName));
          break;
      }

      setCenters(filteredCenters);
    } catch (error) {
      console.error("카센터 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCenters();
  };

  const handleCenterClick = (centerId: string) => {
    navigate(`/centers/${centerId}`);
  };

  const handleBooking = (e: React.MouseEvent, centerId: string, centerName: string) => {
    e.stopPropagation();
    navigate("/estimates/create", { 
      state: { centerId, centerName }
    });
  };

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-surface animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-on-surface">카센터 찾기</h1>
            <Button variant="outline" onClick={mapModal.open}>
              <Navigation className="h-4 w-4 mr-2" />
              지도에서 보기
            </Button>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                    <Input
                      placeholder="카센터명 또는 서비스로 검색..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit">검색</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="지역" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="정렬" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">평점순</SelectItem>
                      <SelectItem value="review">리뷰순</SelectItem>
                      <SelectItem value="name">이름순</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    필터
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 카센터 목록 */}
          <div className="space-y-4">
            {centers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-on-surface-variant">검색 결과가 없습니다.</p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    다른 검색어나 필터를 시도해보세요.
                  </p>
                </CardContent>
              </Card>
            ) : (
              centers.map((center) => (
                <Card 
                  key={center.centerId}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCenterClick(center.centerId)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl text-on-surface">
                            {center.centerName}
                          </CardTitle>
                          {center.isApproved && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              승인완료
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-medium text-on-surface">{center.rating || 0}</span>
                            <span>({center.totalReviews || 0})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{center.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                      <Phone className="h-4 w-4" />
                      <span>{center.phone}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={(e) => handleBooking(e, center.centerId, center.centerName)}
                        className="flex-1"
                      >
                        견적 요청
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleCall(e, center.phone)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 지도 모달 */}
      <CenterMapModal
        isOpen={mapModal.isOpen}
        onClose={mapModal.close}
        centers={centers}
      />
    </PageContainer>
  );
}