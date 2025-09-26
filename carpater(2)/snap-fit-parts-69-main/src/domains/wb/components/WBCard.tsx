import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MessageSquare, Car, Tag, Calendar, Building, Wrench } from "lucide-react";
// ✅ carCenter.api.ts에서 API 서비스와 UsedPartResDTO 타입을 가져옵니다.
import carCenterApi, { UsedPartResDTO } from "@/services/carCenter.api";
import { formatKRW, formatTimeAgo } from "@/shared/utils/format";

export default function UsedPartDetailPage() {
  const navigate = useNavigate();
  // URL로부터 부품 ID를 가져옵니다. (예: /wb/123 -> partId는 '123')
  const { partId } = useParams<{ partId: string }>();

  // API 요청 관련 상태 관리
  const [part, setPart] = useState<UsedPartResDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 페이지가 로드되거나 partId가 변경될 때 API를 호출하여 부품 상세 정보 조회
  useEffect(() => {
    if (!partId) {
      setError("부품 ID가 올바르지 않습니다.");
      return;
    }

    const fetchPartDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await carCenterApi.getUsedPartDetails(Number(partId));
        setPart(data);
      } catch (e) {
        setError("부품 정보를 불러오는 데 실패했습니다.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartDetails();
  }, [partId]);

  // 로딩 및 에러 상태 표시
  if (isLoading) {
    return <PageContainer><div>로딩 중...</div></PageContainer>;
  }
  if (error) {
    return <PageContainer><div className="text-center text-red-500 py-10">{error}</div></PageContainer>;
  }
  if (!part) {
    return <PageContainer><div className="text-center py-10">부품 정보를 찾을 수 없습니다.</div></PageContainer>;
  }

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 좌측: 이미지 캐러셀 */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {part.imageUrls.length > 0 ? (
                  part.imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img src={url} alt={`${part.partName} 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">이미지 없음</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              {part.imageUrls.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>

          {/* 우측: 부품 상세 정보 */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{part.partName}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-semibold">{part.centerId}</span> 에서 등록
              </p>
            </div>

            <div className="text-4xl font-extrabold text-primary">
              {formatKRW(part.price)}
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-semibold w-24">카테고리</span>
                  <span>{part.category || '미지정'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-semibold w-24">호환 차종</span>
                  <span>{part.compatibleCarModel}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-semibold w-24">등록일</span>
                  <span>{formatTimeAgo(part.createdAt.toString())}</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-semibold mb-2">상세 설명</h2>
              <p className="text-base text-foreground/80 whitespace-pre-wrap">
                {part.description}
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t">
        
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}