/**
 * 카센터 찾기 페이지
 * 
 * 이 페이지의 역할:
 * - 주변 카센터 검색 및 필터링
 * - 카센터별 서비스 종류, 위치, 평점 정보 제공
 * - 견적 요청 및 예약 연결 서비스
 * - 지역별, 서비스별 카센터 분류 검색
 * 
 * 왜 필요한가:
 * - 사용자가 신뢰할 수 있는 카센터를 쉽게 찾을 수 있도록 지원
 * - 다양한 조건(위치, 서비스, 평점 등)으로 최적의 카센터 추천
 * - 투명한 정보 제공으로 카센터 선택에 대한 불안감 해소
 * - 카센터와 고객을 연결하는 플랫폼 역할
 */

// 카센터 찾기 페이지 (임시)
import { useState } from "react";
import { MapPin, Search, Filter, Star } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CentersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [location, setLocation] = useState("all");

  // 임시 카센터 데이터
  const centers = [
    {
      id: "1",
      name: "우리카센터",
      location: "서울 강서구",
      rating: 4.9,
      reviews: 127,
      services: ["헤드라이트", "범퍼", "도어", "엔진점검"],
      image: "/api/placeholder/80/80"
    },
    {
      id: "2",
      name: "신속카서비스",
      location: "경기 성남시",
      rating: 4.7,
      reviews: 89,
      services: ["타이어", "브레이크", "배터리", "오일교환"],
      image: "/api/placeholder/80/80"
    },
    {
      id: "3",
      name: "정밀정비센터",
      location: "서울 강남구",
      rating: 4.8,
      reviews: 156,
      services: ["범퍼", "헤드라이트", "사이드미러", "도장"],
      image: "/api/placeholder/80/80"
    }
  ];

  const serviceTypes = [
    { value: "all", label: "전체 서비스" },
    { value: "body", label: "외장 수리" },
    { value: "engine", label: "엔진 점검" },
    { value: "maintenance", label: "정기 점검" },
    { value: "tire", label: "타이어 교체" }
  ];

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">카센터 찾기</h1>
          <p className="text-muted-foreground">믿을 수 있는 카센터를 찾아보세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-card rounded-lg p-4 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">카센터 검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="카센터명 또는 지역을 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-40">
              <label className="text-sm font-medium mb-2 block">서비스 종류</label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <label className="text-sm font-medium mb-2 block">지역</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지역</SelectItem>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="gyeonggi">경기</SelectItem>
                  <SelectItem value="incheon">인천</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="h-10">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            총 {centers.length}개의 카센터
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {centers.map(center => (
            <Card key={center.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={center.image} 
                      alt={center.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{center.name}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">상세보기</Button>
                        <Button size="sm">견적요청</Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {center.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{center.rating}</span>
                        <span className="text-muted-foreground">({center.reviews}개 리뷰)</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {center.services.map(service => (
                        <Badge key={service} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">이전</Button>
            <Button size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">다음</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}