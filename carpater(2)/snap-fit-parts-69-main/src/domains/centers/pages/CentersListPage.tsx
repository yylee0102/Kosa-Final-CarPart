/**
 * 카센터 찾기 목록 페이지 (API 연동 및 백엔드 정렬/필터링 적용)
 */
import { Badge } from "@/components/ui/badge"; // ✅ 이 줄을 추가해주세요.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Star, Search, Navigation } from "lucide-react";
import { useModal } from "@/shared/hooks/useModal";
import CenterMapModal from "../modals/CenterMapModal";
import carCenterApi, { CarCenterResponse } from "@/services/carCenter.api";

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
  const [centers, setCenters] = useState<CarCenterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [sortBy, setSortBy] = useState("rating");
  
  const mapModal = useModal();

  useEffect(() => {
    fetchCenters();
  }, [selectedCategory, selectedDistrict, sortBy]);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const params = {
        keyword: searchKeyword,
        category: selectedCategory,
        district: selectedDistrict,
        sort: sortBy,
      };
      const data = await carCenterApi.searchCenters(params);
      setCenters(data);
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

  /**
   * ✅ [API 연결 불필요]
   * 이 함수는 API를 호출하는 대신, 사용자를 견적서 작성 페이지로 안내하는 '바로가기' 역할입니다.
   * 실제 견적서 제출 API는 이동한 /estimates/create 페이지에서 호출됩니다.
   */
  const handleBooking = (e: React.MouseEvent, centerId: string, centerName: string) => {
    e.stopPropagation();
    navigate("/estimates/create", { 
      state: { centerId, centerName }
    });
  };

  /**
   * ✅ [API 연결 불필요]
   * 이 함수는 'tel:' 프로토콜을 이용해 사용자의 기기에 내장된 전화 앱을 실행시킵니다.
   * 우리 서버와는 통신하지 않습니다.
   */
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
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger><SelectValue placeholder="서비스 종류" /></SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger><SelectValue placeholder="지역" /></SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue placeholder="정렬" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">평점순</SelectItem>
                      <SelectItem value="review">리뷰순</SelectItem>
                      <SelectItem value="name">이름순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 카센터 목록 */}
          <div className="space-y-4">
            {centers.map((center) => (
              <Card 
                key={center.centerId}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCenterClick(center.centerId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl text-on-surface">{center.centerName}</CardTitle>
                        {center.status === 'ACTIVE' && (
                          <Badge variant="default" className="bg-green-100 text-green-800">승인완료</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                           {/* 백엔드 DTO에 평점/리뷰 수가 추가되면 이 부분을 활성화할 수 있습니다. */}
                          <span className="font-medium text-on-surface">?</span>
                          <span>(?)</span>
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
                    <span>{center.phoneNumber}</span>
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
                      onClick={(e) => handleCall(e, center.phoneNumber)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CenterMapModal
        isOpen={mapModal.isOpen}
        onClose={mapModal.close}
        centers={centers}
      />
    </PageContainer>
  );
}