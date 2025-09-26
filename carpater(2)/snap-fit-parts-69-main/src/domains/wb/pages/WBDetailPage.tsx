import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone, Calendar, Car, Tag, Wrench, MapPin, Shield, Clock } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
// ✅ carCenter.api.ts에서 실제 API 서비스와 데이터 타입을 가져옵니다.
import carCenterApi, { UsedPartResDTO } from "@/services/carCenter.api";
import { formatKRW, formatTimeAgo } from "@/shared/utils/format";

export default function CarPartDetail() {
  const { partId } = useParams<{ partId: string }>();
  const navigate = useNavigate();

  // ✅ 상태 변수의 타입을 UsedPartResDTO로 변경합니다.
  const [part, setPart] = useState<UsedPartResDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ✅ 페이지가 로드될 때 실제 API를 호출하도록 수정합니다.
  useEffect(() => {
    if (!partId) {
      setError("부품 ID가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    const fetchPartDetail = async () => {
      try {
        setLoading(true);
        const partData = await carCenterApi.getUsedPartDetails(Number(partId));
        setPart(partData);
      } catch (error) {
        console.error("부품 상세 정보 조회 실패:", error);
        setError("부품 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartDetail();
  }, [partId]);

  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          {/* 로딩 스켈레톤 UI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4"><div className="h-96 bg-muted rounded-2xl" /><div className="grid grid-cols-3 gap-3"><div className="h-24 bg-muted rounded-lg" /><div className="h-24 bg-muted rounded-lg" /><div className="h-24 bg-muted rounded-lg" /></div></div>
            <div className="space-y-6"><div className="h-10 bg-muted rounded w-3/4" /><div className="h-12 bg-muted rounded w-1/2" /><div className="h-48 bg-muted rounded-xl" /><div className="h-14 bg-muted rounded-lg" /></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !part) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{error || "부품을 찾을 수 없습니다"}</h1>
          <Button onClick={() => navigate("/search")}>검색 페이지로 돌아가기</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* 이미지 갤러리 */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-card rounded-2xl overflow-hidden shadow-lg">
                  <img src={part.imageUrls[selectedImageIndex] || "/placeholder.svg"} alt={`${part.partName} 이미지 ${selectedImageIndex + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4"><Badge variant="secondary" className="bg-card/80 backdrop-blur-sm">{selectedImageIndex + 1} / {part.imageUrls.length}</Badge></div>
                </div>
                {part.imageUrls.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {part.imageUrls.map((url, index) => (
                      <button key={index} onClick={() => setSelectedImageIndex(index)} className={`aspect-square bg-card rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? "border-primary shadow-md scale-105" : "border-border hover:border-primary/50"}`}>
                        <img src={url || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 상품 정보 */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Badge variant="outline" className="text-xs">{part.category}</Badge>
                  <h1 className="text-4xl font-bold text-foreground leading-tight">{part.partName}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {/* ✅ DTO에 address가 없으므로 centerName으로 대체 */}
                    <span className="font-medium">{part.centerId} </span>
                  </div>
                </div>
                <div className="text-5xl font-extrabold text-primary">{formatKRW(part.price)}</div>

                {/* 스펙 정보 */}
                <Card className="border-0 bg-muted/30">
                  <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3"><Car className="h-5 w-5 text-primary" /><div><div className="text-sm text-muted-foreground">호환 차종</div><div className="font-semibold">{part.compatibleCarModel}</div></div></div>
                    <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-muted-foreground" /><div><div className="text-sm text-muted-foreground">등록일</div><div className="font-semibold">{formatTimeAgo(part.createdAt)}</div></div></div>
                  </CardContent>
                </Card>

             {/* 상세 설명 섹션 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6"><CardTitle className="text-2xl font-bold flex items-center gap-2"><Clock className="h-6 w-6 text-primary" />상품 상세 설명</CardTitle></CardHeader>
            <CardContent className="prose prose-lg max-w-none"><p className="text-foreground leading-relaxed whitespace-pre-line">{part.description || "상세 설명이 없습니다."}</p></CardContent>
          </Card>
        </div>
      </div>
                
                {/* 연락처 안내 */}
                <Alert className="border-primary/20 bg-primary/5">
                  <Phone className="h-4 w-4" />
                  <AlertTitle className="text-lg">판매자</AlertTitle>
                  <AlertDescription className="mt-2 flex items-center justify-between">
                    <span className="font-semibold">연락처:{part.centerPhoneNumber}</span>
                    <span className="font-mono text-base"></span>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </PageContainer>
  );
}