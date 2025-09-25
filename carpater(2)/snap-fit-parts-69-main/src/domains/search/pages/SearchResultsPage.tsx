/**
 * 검색 결과 페이지
 * 
 * 이 페이지의 역할:
 * - 중고부품 및 카센터 통합 검색 결과 표시
 * - 필터링 및 정렬 기능으로 원하는 결과 빠르게 찾기
 * - 부품과 카센터 정보를 카드 형태로 직관적 표시
 * - 페이지네이션으로 대량 검색 결과 효율적 탐색
 * 
 * 왜 필요한가:
 * - 사용자가 원하는 부품이나 카센터를 쉽게 찾을 수 있는 중앙 검색 허브
 * - 다양한 조건으로 필터링하여 최적의 선택지 제공
 * - 검색부터 구매/예약까지 seamless한 사용자 경험
 */

// 검색 결과 페이지 - 중고부품 및 카센터 검색 결과 표시 (임시 데이터 사용)
import { useState } from "react";
import { Search, Filter, SortDesc } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useNavigate } from "react-router-dom";

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterType, setFilterType] = useState("parts");

  const searchResults = [
    {
      id: "1",
      title: "현대 아반떼 헤드라이트 (우측)",
      price: 150000,
      location: "서울 강남구",
      condition: "중고A급",
      seller: "신차부품할인점",
      rating: 4.8,
      image: "/api/placeholder/120/120",
      type: "part"
    },
    {
      id: "2",
      title: "기아 쏘렌토 앞범퍼",
      price: 280000,
      location: "경기 성남시",
      condition: "중고B급",
      seller: "중고부품마트",
      rating: 4.5,
      image: "/api/placeholder/120/120",
      type: "part"
    },
    {
      id: "3",
      title: "우리카센터",
      location: "서울 강서구",
      rating: 4.9,
      reviews: 127,
      services: ["헤드라이트", "범퍼", "도어"],
      type: "center"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "신품": return "bg-primary text-primary-foreground";
      case "중고A급": return "bg-secondary text-secondary-foreground";
      case "중고B급": return "bg-tertiary text-tertiary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // 정렬 함수
  const sortResults = (results: any[]) => {
    const sorted = [...results];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "recent":
      default:
        return sorted; // 이미 최신순 정렬되어 있다고 가정
    }
  };

  // 필터링된 결과
  const filteredResults = searchResults.filter(result => {
    if (filterType === "parts") return result.type === "part";
    if (filterType === "centers") return result.type === "center";
    return true;
  });

  // 정렬된 결과
  const sortedResults = sortResults(filteredResults);

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 검색바 */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="부품명, 카센터명을 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="parts">부품</SelectItem>
                <SelectItem value="centers">카센터</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">최신순</SelectItem>
                <SelectItem value="price-low">가격낮은순</SelectItem>
                <SelectItem value="price-high">가격높은순</SelectItem>
                <SelectItem value="rating">평점순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            총 {sortedResults.length}개의 결과
          </p>
        </div>

        {/* 검색 결과 */}
        <div className="grid grid-cols-1 gap-4">
          {sortedResults.map(result => (
            <Card 
              key={result.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => result.type === 'part' ? navigate(`/wb/${result.id}`) : navigate(`/centers/${result.id}`)}
            >
              <CardContent className="p-4">
                {result.type === 'part' ? (
                  /* 부품 결과 */
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={result.image} 
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{result.title}</h3>
                        <Badge className={getConditionColor(result.condition)}>
                          {result.condition}
                        </Badge>
                      </div>
                      <p className="text-xl font-bold text-primary mb-2">
                        {formatPrice(result.price)}
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>판매자: {result.seller}</p>
                        <p>지역: {result.location}</p>
                        <div className="flex items-center gap-1">
                          <span>평점: {result.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(result.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 카센터 결과 */
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                      <p className="text-muted-foreground mb-2">{result.location}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>평점: {result.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(result.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <span>리뷰 {result.reviews}개</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {result.services?.map(service => (
                          <Badge key={service} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/centers/${result.id}`);
                      }}>상세보기</Button>
                    </div>
                  </div>
                )}
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