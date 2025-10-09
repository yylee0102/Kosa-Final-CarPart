import { useState } from "react";
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Eye, Send } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function CenterEstimatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // 받은 견적 요청 (카센터가 고객으로부터 받은 요청)
  const estimateRequests = [
    {
      id: "1",
      customerName: "김철수",
      customerPhone: "010-1234-5678",
      carInfo: "현대 아반떼 2020년",
      partName: "헤드라이트",
      description: "사고로 인한 헤드라이트 파손, 교체 필요",
      requestDate: "2024-01-15",
      status: "pending",
      isUrgent: true,
      budget: 200000
    },
    {
      id: "2", 
      customerName: "이영희",
      customerPhone: "010-9876-5432",
      carInfo: "기아 쏘렌토 2019년",
      partName: "앞범퍼",
      description: "주차 중 접촉사고로 범퍼 손상",
      requestDate: "2024-01-14",
      status: "pending",
      isUrgent: false,
      budget: 300000
    }
  ];

  // 작성한 견적서 (카센터가 고객에게 보낸 견적)
  const sentEstimates = [
    {
      id: "1",
      customerName: "박민수",
      carInfo: "BMW 3시리즈 2018년",
      partName: "사이드미러",
      estimateAmount: 180000,
      createdDate: "2024-01-13",
      status: "sent",
      validUntil: "2024-01-20"
    },
    {
      id: "2",
      customerName: "정수진",
      carInfo: "벤츠 C클래스 2021년", 
      partName: "테일라이트",
      estimateAmount: 250000,
      createdDate: "2024-01-12",
      status: "accepted",
      validUntil: "2024-01-19"
    },
    {
      id: "3",
      customerName: "홍길동",
      carInfo: "토요타 캠리 2020년",
      partName: "도어",
      estimateAmount: 400000,
      createdDate: "2024-01-11", 
      status: "rejected",
      validUntil: "2024-01-18"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white">대기중</Badge>;
      case "sent":
        return <Badge className="bg-blue-500 text-white">발송완료</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 text-white">승인됨</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white">거절됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const handleCreateEstimate = (requestId: string) => {
    // TODO: API 연결 - 견적서 작성 페이지로 이동
    navigate(`/estimates/create/${requestId}`);
  };

  const handleViewEstimate = (estimateId: string) => {
    // TODO: API 연결 - 견적서 상세 보기
    navigate(`/estimates/${estimateId}`);
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">견적 관리</h1>
            <p className="text-on-surface-variant">고객 요청 처리 및 견적서 관리</p>
          </div>
          <Button onClick={() => navigate("/estimates/create")}>
            <Plus className="h-4 w-4 mr-2" />
            새 견적서 작성
          </Button>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <Input
              placeholder="고객명 또는 차량으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 탭 영역 */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              견적 요청 ({estimateRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              발송 견적서 ({sentEstimates.length})
            </TabsTrigger>
          </TabsList>

          {/* 받은 견적 요청 */}
          <TabsContent value="requests">
            <div className="space-y-4">
              {estimateRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-elevation-2 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-on-surface">
                            {request.customerName}
                          </h3>
                          {request.isUrgent && (
                            <Badge className="bg-red-500 text-white">긴급</Badge>
                          )}
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-on-surface-variant">차량정보:</span>
                            <p className="font-medium">{request.carInfo}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">필요부품:</span>
                            <p className="font-medium">{request.partName}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">희망예산:</span>
                            <p className="font-medium text-primary">
                              {formatCurrency(request.budget)}
                            </p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">요청일:</span>
                            <p className="font-medium">{request.requestDate}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-on-surface-variant text-sm">상세 설명:</span>
                          <p className="text-on-surface mt-1">{request.description}</p>
                        </div>

                        <div className="mb-4">
                          <span className="text-on-surface-variant text-sm">연락처:</span>
                          <p className="font-medium">{request.customerPhone}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleCreateEstimate(request.id)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          견적서 작성
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${request.customerPhone}`)}
                        >
                          전화하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {estimateRequests.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                    <h3 className="font-medium text-on-surface mb-2">
                      현재 대기 중인 견적 요청이 없습니다
                    </h3>
                    <p className="text-on-surface-variant">
                      새로운 요청이 들어오면 알림을 보내드립니다
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 발송한 견적서 */}
          <TabsContent value="sent">
            <div className="space-y-4">
              {sentEstimates.map((estimate) => (
                <Card key={estimate.id} className="hover:shadow-elevation-2 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-on-surface">
                            {estimate.customerName}
                          </h3>
                          {getStatusBadge(estimate.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-on-surface-variant">차량정보:</span>
                            <p className="font-medium">{estimate.carInfo}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">부품명:</span>
                            <p className="font-medium">{estimate.partName}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">견적금액:</span>
                            <p className="font-medium text-primary">
                              {formatCurrency(estimate.estimateAmount)}
                            </p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">작성일:</span>
                            <p className="font-medium">{estimate.createdDate}</p>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-on-surface-variant">유효기간:</span>
                          <span className="font-medium ml-2">{estimate.validUntil}까지</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEstimate(estimate.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          상세보기
                        </Button>
                        {estimate.status === "sent" && (
                          <Button variant="outline" size="sm">
                            재발송
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sentEstimates.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                    <h3 className="font-medium text-on-surface mb-2">
                      발송한 견적서가 없습니다
                    </h3>
                    <p className="text-on-surface-variant">
                      고객 요청에 견적서를 작성해보세요
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}