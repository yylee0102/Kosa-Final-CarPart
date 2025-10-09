import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Calendar, MapPin, Car } from "lucide-react";
import { formatTimeAgo, formatKRW } from "@/shared/utils/format";
import { useModal } from "@/shared/hooks/useModal";
import SortFilterModal from "../modals/SortFilterModal";

interface Estimate {
  id: string;
  title: string;
  description: string;
  carInfo: {
    brand: string;
    model: string;
    year: string;
    mileage: number;
  };
  category: string;
  status: "요청" | "견적발송" | "확정" | "완료" | "취소";
  estimatedCost?: number;
  workDays?: number;
  images: string[];
  location: string;
  createdAt: string;
  responseCount: number;
}

const statusColors = {
  "요청": "default",
  "견적발송": "secondary", 
  "확정": "default",
  "완료": "default",
  "취소": "destructive"
} as const;

export default function EstimateListPage() {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const sortFilterModal = useModal();

  useEffect(() => {
    // API 연결: 내 견적 요청 목록 조회
    // GET /api/estimates?status=&category=&keyword=
    fetchEstimates();
  }, [activeTab, selectedCategory, searchKeyword]);

  const fetchEstimates = async () => {
    try {
      setLoading(true);

      // 임시 데이터 (실제로는 API 호출)
      const mockEstimates: Estimate[] = [
        {
          id: "1",
          title: "브레이크 패드 교체 요청",
          description: "브레이크에서 소음이 나고 제동력이 약해진 것 같습니다.",
          carInfo: {
            brand: "현대",
            model: "소나타",
            year: "2020",
            mileage: 45000
          },
          category: "브레이크 정비",
          status: "견적발송",
          images: ["/placeholder.svg"],
          location: "서울시 강남구",
          createdAt: "2024-01-15T09:00:00Z",
          responseCount: 3
        },
        {
          id: "2", 
          title: "에어컨 수리 문의",
          description: "에어컨 바람이 시원하지 않습니다.",
          carInfo: {
            brand: "기아",
            model: "K5",
            year: "2019", 
            mileage: 38000
          },
          category: "에어컨 수리",
          status: "요청",
          images: [],
          location: "서울시 서초구",
          createdAt: "2024-01-14T14:30:00Z",
          responseCount: 0
        }
      ];

      // 탭에 따른 필터링
      let filteredEstimates = mockEstimates;
      if (activeTab !== "all") {
        filteredEstimates = mockEstimates.filter(est => est.status === activeTab);
      }

      setEstimates(filteredEstimates);
    } catch (error) {
      console.error("견적 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateClick = (estimateId: string) => {
    navigate(`/estimates/${estimateId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEstimates();
  };

  const categories = [
    "전체", "엔진 수리", "브레이크 정비", "타이어 교체", 
    "에어컨 수리", "전기계통", "차체 수리", "기타"
  ];

  const getStatusBadgeVariant = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "default";
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface animate-pulse rounded-lg" />
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
            <h1 className="text-2xl font-bold text-on-surface">내 견적 요청</h1>
            <Button onClick={() => navigate("/estimates/create")}>
              <Plus className="h-4 w-4 mr-2" />
              견적 요청하기
            </Button>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                    <Input
                      placeholder="견적 제목 또는 내용으로 검색..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit">검색</Button>
                </form>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category === "전체" ? "" : category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={sortFilterModal.open}>
                  <Filter className="h-4 w-4 mr-2" />
                  정렬
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 상태별 탭 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="요청">요청중</TabsTrigger>
              <TabsTrigger value="견적발송">견적받음</TabsTrigger>
              <TabsTrigger value="확정">확정</TabsTrigger>
              <TabsTrigger value="완료">완료</TabsTrigger>
              <TabsTrigger value="취소">취소</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {estimates.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-on-surface-variant">등록된 견적 요청이 없습니다.</p>
                    <Button 
                      onClick={() => navigate("/estimates/create")}
                      className="mt-4"
                    >
                      첫 견적 요청하기
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                estimates.map((estimate) => (
                  <Card 
                    key={estimate.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleEstimateClick(estimate.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getStatusBadgeVariant(estimate.status)}>
                              {estimate.status}
                            </Badge>
                            <Badge variant="outline">{estimate.category}</Badge>
                            {estimate.responseCount > 0 && (
                              <Badge variant="secondary">
                                {estimate.responseCount}개 견적
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg text-on-surface">
                            {estimate.title}
                          </CardTitle>
                        </div>
                        {estimate.images.length > 0 && (
                          <img
                            src={estimate.images[0]}
                            alt="견적 요청 이미지"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
                        {estimate.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{estimate.carInfo.brand} {estimate.carInfo.model}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{estimate.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatTimeAgo(estimate.createdAt)}</span>
                        </div>
                      </div>

                      {estimate.estimatedCost && (
                        <div className="mt-3 pt-3 border-t border-outline-variant">
                          <div className="flex justify-between items-center">
                            <span className="text-on-surface-variant">예상 비용</span>
                            <span className="font-semibold text-primary">
                              {formatKRW(estimate.estimatedCost)}
                            </span>
                          </div>
                          {estimate.workDays && (
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-on-surface-variant">예상 작업일</span>
                              <span className="text-on-surface">{estimate.workDays}일</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 정렬/필터 모달 */}
      <SortFilterModal
        isOpen={sortFilterModal.isOpen}
        onClose={sortFilterModal.close}
        onApply={(filters) => {
          console.log("정렬/필터 적용:", filters);
          sortFilterModal.close();
        }}
      />
    </PageContainer>
  );
}