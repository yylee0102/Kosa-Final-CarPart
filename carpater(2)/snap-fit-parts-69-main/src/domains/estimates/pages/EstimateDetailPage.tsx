import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Car, Phone, MessageCircle, Star, Clock } from "lucide-react";
import { formatTimeAgo, formatKRW, formatKoreanDateTime } from "@/shared/utils/format";
import { useModal } from "@/shared/hooks/useModal";
import EstimateSendModal from "../modals/EstimateSendModal";

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
  images: string[];
  location: string;
  createdAt: string;
  requester: {
    id: string;
    name: string;
    rating: number;
    phone: string;
  };
}

interface EstimateResponse {
  id: string;
  centerId: string;
  centerName: string;
  estimatedCost: number;
  workDays: number;
  description: string;
  createdAt: string;
  centerRating: number;
  isConfirmed: boolean;
}

export default function EstimateDetailPage() {
  const { estimateId } = useParams();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [responses, setResponses] = useState<EstimateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const estimateSendModal = useModal();

  useEffect(() => {
    // API 연결: 견적 요청 상세 조회
    // GET /api/estimates/:estimateId
    fetchEstimateDetail();
  }, [estimateId]);

  const fetchEstimateDetail = async () => {
    try {
      setLoading(true);

      // 임시 데이터 (실제로는 API 호출)
      const mockEstimate: Estimate = {
        id: estimateId || "1",
        title: "브레이크 패드 교체 요청",
        description: "브레이크에서 소음이 나고 제동력이 약해진 것 같습니다. 최근에 브레이크를 밟을 때 끼익거리는 소리가 자주 나고, 정지거리도 평소보다 길어진 느낌입니다.",
        carInfo: {
          brand: "현대",
          model: "소나타",
          year: "2020",
          mileage: 45000
        },
        category: "브레이크 정비",
        status: "견적발송",
        images: ["/placeholder.svg", "/placeholder.svg"],
        location: "서울시 강남구",
        createdAt: "2024-01-15T09:00:00Z",
        requester: {
          id: "user1",
          name: "김**",
          rating: 4.8,
          phone: "010-1234-5678"
        }
      };

      const mockResponses: EstimateResponse[] = [
        {
          id: "1",
          centerId: "center1",
          centerName: "믿음 자동차 정비소",
          estimatedCost: 150000,
          workDays: 1,
          description: "브레이크 패드 및 디스크 점검 후 교체 예정입니다. 정품 부품 사용합니다.",
          createdAt: "2024-01-15T10:30:00Z",
          centerRating: 4.9,
          isConfirmed: false
        },
        {
          id: "2",
          centerId: "center2", 
          centerName: "전문 카서비스",
          estimatedCost: 135000,
          workDays: 1,
          description: "브레이크 패드 교체와 함께 브레이크 오일도 교체하는 것을 권합니다.",
          createdAt: "2024-01-15T11:15:00Z",
          centerRating: 4.7,
          isConfirmed: false
        }
      ];

      setEstimate(mockEstimate);
      setResponses(mockResponses);
    } catch (error) {
      console.error("견적 상세 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEstimate = async (responseId: string) => {
    try {
      // API 연결: 견적 확정
      // POST /api/estimates/:estimateId/confirm
      // { responseId }
      
      // 임시: 성공 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 상태 업데이트
      setEstimate(prev => prev ? { ...prev, status: "확정" } : null);
      setResponses(prev => prev.map(resp => 
        resp.id === responseId 
          ? { ...resp, isConfirmed: true }
          : resp
      ));

    } catch (error) {
      console.error("견적 확정 실패:", error);
    }
  };

  const handleChatWithCenter = (centerId: string) => {
    // API 연결: 카센터와 채팅방 생성
    // POST /api/chat/rooms
    navigate("/chat", { 
      state: { type: "center", centerId, estimateId }
    });
  };

  const handleCallCenter = (centerId: string) => {
    // 전화걸기 (실제 구현 시 전화번호 필요)
    console.log("카센터 전화:", centerId);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 bg-surface animate-pulse rounded" />
            <div className="h-64 bg-surface animate-pulse rounded" />
            <div className="h-32 bg-surface animate-pulse rounded" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!estimate) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface">견적 요청을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate("/estimates")} className="mt-4">
            견적 목록으로
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* 견적 요청 정보 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{estimate.status}</Badge>
                  <Badge variant="outline">{estimate.category}</Badge>
                </div>
                <CardTitle className="text-2xl text-on-surface">{estimate.title}</CardTitle>
              </div>
              {estimate.status === "요청" && (
                <Button onClick={estimateSendModal.open}>
                  견적서 작성
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatKoreanDateTime(estimate.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{estimate.location}</span>
              </div>
            </div>

            <p className="text-on-surface">{estimate.description}</p>

            {/* 차량 정보 */}
            <div className="bg-surface p-4 rounded-lg">
              <h3 className="font-medium text-on-surface mb-2 flex items-center gap-2">
                <Car className="h-4 w-4" />
                차량 정보
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-on-surface-variant">브랜드/모델: </span>
                  <span className="text-on-surface">{estimate.carInfo.brand} {estimate.carInfo.model}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">연식: </span>
                  <span className="text-on-surface">{estimate.carInfo.year}년</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">주행거리: </span>
                  <span className="text-on-surface">{estimate.carInfo.mileage.toLocaleString()}km</span>
                </div>
              </div>
            </div>

            {/* 첨부 이미지 */}
            {estimate.images.length > 0 && (
              <div>
                <h3 className="font-medium text-on-surface mb-2">첨부 사진</h3>
                <div className="grid grid-cols-3 gap-2">
                  {estimate.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`견적 요청 사진 ${index + 1}`}
                      className="aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 요청자 정보 */}
            <div className="bg-surface p-4 rounded-lg">
              <h3 className="font-medium text-on-surface mb-2">요청자 정보</h3>
              <div className="flex items-center gap-4">
                <span className="font-medium text-on-surface">{estimate.requester.name}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm text-on-surface">{estimate.requester.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm text-on-surface-variant">
                    {estimate.requester.phone}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 받은 견적들 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-on-surface">
            받은 견적 ({responses.length})
          </h2>

          {responses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
                <p className="text-on-surface-variant">아직 받은 견적이 없습니다.</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  카센터들이 견적을 보내면 알림으로 안내드리겠습니다.
                </p>
              </CardContent>
            </Card>
          ) : (
            responses.map((response) => (
              <Card key={response.id} className={response.isConfirmed ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg text-on-surface">
                          {response.centerName}
                        </CardTitle>
                        {response.isConfirmed && (
                          <Badge variant="default">확정</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm text-on-surface">{response.centerRating}</span>
                        </div>
                        <span className="text-sm text-on-surface-variant">
                          {formatTimeAgo(response.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatKRW(response.estimatedCost)}
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        작업일: {response.workDays}일
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-on-surface mb-4">{response.description}</p>
                  
                  <div className="flex gap-2">
                    {!response.isConfirmed && estimate.status !== "확정" && (
                      <Button 
                        onClick={() => handleConfirmEstimate(response.id)}
                        className="flex-1"
                      >
                        이 견적으로 확정하기
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => handleChatWithCenter(response.centerId)}
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      채팅 문의
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCallCenter(response.centerId)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 견적서 작성 모달 (카센터용) */}
      <EstimateSendModal
        isOpen={estimateSendModal.isOpen}
        onClose={estimateSendModal.close}
        estimateId={estimate.id}
      />
    </PageContainer>
  );
}