// SearchResultsPage.tsx - 부품 검색 전용 최종본
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, SortDesc } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ✅ carCenterApi와 UsedPartResDTO 타입을 가져옵니다.
import carCenterApi, { UsedPartResDTO } from "@/services/carCenter.api";

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 헤더가 넘겨준 검색어를 가져옵니다.
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  // API 요청 관련 상태
  const [results, setResults] = useState<UsedPartResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 정렬 조건 상태
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>("recent");

  // 검색 및 정렬 로직
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
          setResults([]);
          return;
      }
      setIsLoading(true);
      setError(null);
      try {
        // ✅ 부품 검색 전용 API 호출
        const parts = await carCenterApi.searchParts(searchQuery);
        setResults(parts);
      } catch (e) {
        setError("검색 중 오류가 발생했습니다.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    performSearch();
  }, [searchQuery]); // 검색어가 바뀔 때만 API 호출

  // 정렬된 결과
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'recent':
      default:
        // createdAt은 문자열이므로 Date 객체로 변환하여 비교
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 페이지 제목 */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold">
                <span className="text-primary">'{searchQuery}'</span>
                <span className="text-foreground"> 부품 검색 결과</span>
            </h1>
        </div>

        {/* 정렬 기능 */}
        <div className="flex justify-between items-center mb-6">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)} disabled={isLoading}>
            <SelectTrigger className="w-32">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="price-low">가격낮은순</SelectItem>
              <SelectItem value="price-high">가격높은순</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">총 {sortedResults.length}개의 결과</p>
        </div>

        {/* 검색 결과 */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading && <p className="text-center py-10">검색 중...</p>}
          {error && <p className="text-center text-red-500 py-10">{error}</p>}
          {!isLoading && !error && sortedResults.length === 0 && (
            <p className="text-center text-muted-foreground py-10">검색 결과가 없습니다.</p>
          )}
          {!isLoading && !error && sortedResults.map(part => (
            <Card 
              key={part.partId} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/wb/${part.partId}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {part.imageUrls?.[0] ? (
                      <img src={part.imageUrls[0]} alt={part.partName} className="w-full h-full object-cover"/>
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{part.partName}</h3>
                    <p className="text-xl font-bold text-primary my-1">{formatPrice(part.price)}</p>
                    <p className="text-sm text-muted-foreground">호환: {part.compatibleCarModel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}