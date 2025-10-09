import { useState } from "react";
import { Search, Plus, Clock, CheckCircle, XCircle, Eye, MessageCircle } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function EstimateRequestPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // 내가 요청한 견적들 (고객이 카센터에게 요청한 견적)
  const myRequests = [
    {
      id: "1",
      centerName: "스타카센터",
      centerLocation: "서울 강남구",
      carInfo: "현대 아반떼 2020년",
      partName: "헤드라이트",
      requestDate: "2024-01-15",
      status: "pending",
      description: "사고로 인한 헤드라이트 파손, 교체 필요",
      isUrgent: true
    },
    {
      id: "2",
      centerName: "프리미엄카센터", 
      centerLocation: "경기 성남시",
      carInfo: "현대 아반떼 2020년",
      partName: "헤드라이트",
      requestDate: "2024-01-15",
      status: "pending",
      description: "사고로 인한 헤드라이트 파손, 교체 필요",
      isUrgent: true
    }
  ];

  // 받은 견적서들 (카센터에서 보내온 견적)
  const receivedEstimates = [
    {
      id: "1",
      centerName: "베스트카센터",
      centerLocation: "서울 강서구",
      carInfo: "기아 쏘렌토 2019년",
      partName: "앞범퍼",
      estimateAmount: 280000,
      laborCost: 100000,
      partCost: 180000,
      receivedDate: "2024-01-14",
      validUntil: "2024-01-21",
      status: "received",
      centerRating: 4.8,
      description: "순정부품 사용, 1년 무상 A/S 제공"
    },
    {
      id: "2",
      centerName: "퀵카센터",
      centerLocation: "인천 연수구", 
      carInfo: "기아 쏘렌토 2019년",
      partName: "앞범퍼",
      estimateAmount: 250000,
      laborCost: 80000,
      partCost: 170000,
      receivedDate: "2024-01-14",
      validUntil: "2024-01-21",
      status: "received",
      centerRating: 4.5,
      description: "동급부품 사용, 6개월 무상 A/S 제공"
    },
    {
      id: "3",
      centerName: "신속카센터",
      centerLocation: "서울 마포구",
      carInfo: "BMW 3시리즈 2018년", 
      partName: "사이드미러",
      estimateAmount: 180000,
      laborCost: 50000,
      partCost: 130000,
      receivedDate: "2024-01-13",
      validUntil: "2024-01-20",
      status: "accepted",
      centerRating: 4.7,
      description: "순정부품 사용, 당일 작업 가능"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white">답변대기</Badge>;
      case "received":
        return <Badge className="bg-blue-500 text-white">견적접수</Badge>;
      case "accepted":
        return <Badge className="bg-green-500 text-white">승인완료</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white">거절</Badge>;
      case "completed":
        return <Badge className="bg-purple-500 text-white">작업완료</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const handleAcceptEstimate = async (estimateId: string) => {
    // TODO: API 연결 - 견적 승인
    // PUT /api/estimates/{estimateId}/accept
    try {
      console.log("견적 승인:", estimateId);
      alert("견적을 승인했습니다. 카센터에서 연락드릴 예정입니다.");
    } catch (error) {
      console.error("견적 승인 실패:", error);
    }
  };

  const handleRejectEstimate = async (estimateId: string) => {
    // TODO: API 연결 - 견적 거절
    // PUT /api/estimates/{estimateId}/reject
    try {
      console.log("견적 거절:", estimateId);
      alert("견적을 거절했습니다.");
    } catch (error) {
      console.error("견적 거절 실패:", error);
    }
  };

  const handleContactCenter = (centerName: string) => {
    // TODO: API 연결 - 카센터와 채팅
    navigate("/chat");
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">견적 요청 관리</h1>
            <p className="text-on-surface-variant">내 견적 요청 및 받은 견적서 관리</p>
          </div>
          <Button onClick={() => navigate("/estimates/create")}>
            <Plus className="h-4 w-4 mr-2" />
            새 견적 요청
          </Button>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <Input
              placeholder="카센터명 또는 부품명으로 검색..."
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
              내 요청 ({myRequests.length})
            </TabsTrigger>
            <TabsTrigger value="estimates" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              받은 견적 ({receivedEstimates.length})
            </TabsTrigger>
          </TabsList>

          {/* 내 견적 요청 */}
          <TabsContent value="requests">
            <div className="space-y-4">
              {myRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-elevation-2 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-on-surface">
                            {request.centerName}
                          </h3>
                          <span className="text-on-surface-variant">
                            ({request.centerLocation})
                          </span>
                          {request.isUrgent && (
                            <Badge className="bg-red-500 text-white">긴급</Badge>
                          )}
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-on-surface-variant">차량정보:</span>
                            <p className="font-medium">{request.carInfo}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">필요부품:</span>
                            <p className="font-medium">{request.partName}</p>
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
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactCenter(request.centerName)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          채팅하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {myRequests.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                    <h3 className="font-medium text-on-surface mb-2">
                      요청한 견적이 없습니다
                    </h3>
                    <p className="text-on-surface-variant mb-4">
                      카센터에 견적을 요청해보세요
                    </p>
                    <Button onClick={() => navigate("/estimates/create")}>
                      견적 요청하기
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 받은 견적서 */}
          <TabsContent value="estimates">
            <div className="space-y-4">
              {receivedEstimates.map((estimate) => (
                <Card key={estimate.id} className="hover:shadow-elevation-2 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-on-surface">
                            {estimate.centerName}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-on-surface-variant">
                              {estimate.centerRating}
                            </span>
                          </div>
                          <span className="text-on-surface-variant">
                            ({estimate.centerLocation})
                          </span>
                          {getStatusBadge(estimate.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-on-surface-variant">차량정보:</span>
                            <p className="font-medium">{estimate.carInfo}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">부품명:</span>
                            <p className="font-medium">{estimate.partName}</p>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">접수일:</span>
                            <p className="font-medium">{estimate.receivedDate}</p>
                          </div>
                        </div>

                        {/* 견적 상세 */}
                        <div className="bg-surface-container rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-on-surface mb-3">견적 내역</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-on-surface-variant">부품비:</span>
                              <span>{formatCurrency(estimate.partCost)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-on-surface-variant">공임비:</span>
                              <span>{formatCurrency(estimate.laborCost)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-primary">
                              <span>총 금액:</span>
                              <span>{formatCurrency(estimate.estimateAmount)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-on-surface-variant text-sm">상세 설명:</span>
                          <p className="text-on-surface mt-1">{estimate.description}</p>
                        </div>

                        <div className="text-sm">
                          <span className="text-on-surface-variant">유효기간:</span>
                          <span className="font-medium ml-2 text-red-500">
                            {estimate.validUntil}까지
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {estimate.status === "received" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptEstimate(estimate.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              승인
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectEstimate(estimate.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              거절
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactCenter(estimate.centerName)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          채팅하기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/estimates/${estimate.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          상세보기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {receivedEstimates.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                    <h3 className="font-medium text-on-surface mb-2">
                      받은 견적서가 없습니다
                    </h3>
                    <p className="text-on-surface-variant mb-4">
                      견적을 요청하면 카센터에서 견적서를 보내드립니다
                    </p>
                    <Button onClick={() => navigate("/estimates/create")}>
                      견적 요청하기
                    </Button>
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