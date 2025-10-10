/**
 * 홈페이지 (메인 랜딩 페이지)
 *
 * 이 페이지의 역할:
 * - 서비스 소개 및 주요 기능 안내
 * - 빠른 액션 버튼으로 핵심 서비스 접근
 * - 최신 등록 부품 미리보기
 * - 신규 방문자를 위한 서비스 가이드
 */
import { MapPin, FileText, MessageCircle, Wrench, Star, Sparkles, Zap, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import carCenterApi, { UsedPartResDTO } from "@/services/carCenter.api";

export default function HomePage() {
  const navigate = useNavigate();

  // API로부터 받아온 최신 부품 목록을 저장할 state
  const [recentParts, setRecentParts] = useState<UsedPartResDTO[]>([]);
  // 데이터 로딩 상태를 관리할 state
  const [isLoading, setIsLoading] = useState(true);
  // 에러 상태를 관리할 state
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트가 처음 렌더링될 때 '최신 중고 부품' 목록을 불러옵니다.
  useEffect(() => {
    const fetchRecentParts = async () => {
      try {
        setIsLoading(true);
        const partsData = await carCenterApi.getRecentParts();
        setRecentParts(partsData);
        setError(null);
      } catch (err) {
        setError("최신 부품을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentParts();
  }, []);

  const quickActions = [
    {
      icon: Wrench,
      title: "AI 견적",
      description: "AI 자동견적",
      color: "bg-primary text-primary-foreground",
      onClick: () => navigate("/estimates/ai")
    },
    {
      icon: MapPin,
      title: "주변 센터",
      description: "카센터 찾기",
      color: "bg-secondary text-secondary-foreground",
      onClick: () => navigate("/centers")
    },
    {
      icon: FileText,
      title: "견적 요청",
      description: "수리 견적서",
      color: "bg-tertiary text-tertiary-foreground",
      onClick: () => navigate("/estimates/create")
    },
    {
      icon: MessageCircle,
      title: "채팅",
      description: "실시간 채팅",
      color: "bg-brand-accent text-on-surface",
      onClick: () => navigate("/chat")
    },
    {
      icon: FileText,
      title: "공지사항",
      description: "새소식 확인",
      color: "bg-surface-container-high text-on-surface",
      onClick: () => navigate("/support/notices")
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 히어로 섹션 - AI 견적을 중심으로 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-3xl p-8 md:p-16 mb-16">
          {/* ... 히어로 섹션 내부 코드는 생략 ... */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-secondary/15 via-secondary/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-tertiary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <div className="mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI로 견적을 받아보세요
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-brand-primary to-secondary bg-clip-text text-transparent">AI 견적</span>{" "}받기
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
                사진 한 장으로 즉시 정확한 수리 견적을 받아보세요.<br/>
                <span className="text-primary font-semibold">확실하게</span> AI가 분석해드립니다.
              </p>
            </div>
            <div className="mb-16 animate-scale-in">
              <Button size="lg" onClick={() => navigate("/estimates/ai")} className="group relative bg-gradient-to-r from-primary via-brand-primary to-primary hover:from-primary/90 hover:via-brand-primary/90 hover:to-primary/90 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-primary/25 hover-scale transition-all duration-300">
                <Zap className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                AI 견적 받기 
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
              <p className="text-sm text-on-surface-variant mt-4 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                평균 3초 소요 • 무료 • 정확도 95%
              </p>
            </div>
          </div>
        </div>

        {/* 퀵 액션 그리드 */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-on-surface mb-4">다른 서비스도 살펴보세요</h2>
            <p className="text-lg text-on-surface-variant">원하는 서비스를 바로 이용해보세요</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickActions.filter(action => action.title !== "AI 견적").map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="group cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-surface to-surface-container" onClick={action.onClick}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{action.title}</h3>
                    <p className="text-sm text-on-surface-variant">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 최신 등록 부품 */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-on-surface mb-2">최신 등록 부품</h2>
            <p className="text-on-surface-variant">새로 등록된 중고부품을 확인해보세요</p>
          </div>
          
          {isLoading && <p className="text-center">부품 목록을 불러오는 중입니다...</p>}
          {error && <p className="text-center text-destructive">{error}</p>}
          {!isLoading && !error && recentParts.length === 0 && (
            <p className="text-center text-on-surface-variant">현재 등록된 부품이 없습니다.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentParts.map((part, index) => (
              <Card 
                key={part.partId}
                className="group cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-surface to-surface-container animate-fade-in"
                // ✅ 이 부분을 클릭하면 부품 ID를 가지고 상세 페이지로 이동합니다.
                onClick={() => navigate(`/wb/${part.partId}`)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-2xl bg-surface-container mb-6 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={part.imageUrls[0] || "/api/placeholder/200/200"} 
                      alt={part.partName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <Badge className="text-xs font-medium bg-secondary text-secondary-foreground">
                      {part.category}
                    </Badge>
                    
                    <h3 className="font-bold text-on-surface text-lg leading-tight group-hover:text-primary transition-colors">
                      {part.partName}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-primary bg-clip-text text-transparent">
                        {formatPrice(part.price)}
                      </p>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1">
                         <MapPin className="h-3 w-3" />
                         {part.centerPhoneNumber || '정보 없음'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}