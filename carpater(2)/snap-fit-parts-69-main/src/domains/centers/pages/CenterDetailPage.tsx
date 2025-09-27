import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Clock, Star, MessageCircle } from "lucide-react";
import { useModal } from "@/shared/hooks/useModal";
import ReviewReportModal from "../modals/ReviewReportModal";
// ✅ [수정] API 서비스와 응답 타입을 import 합니다.
import carCenterApiService, { CarCenterResponse, Review } from "@/services/carCenter.api";
import { useToast } from "@/hooks/use-toast";

export default function CenterDetailPage() {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ [수정] State의 타입을 API 응답 DTO로 변경합니다.
  const [center, setCenter] = useState<CarCenterResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const reportModal = useModal();

  useEffect(() => {
    // centerId가 유효하지 않으면 API를 호출하지 않습니다.
    if (!centerId) {
      toast({ title: "오류", description: "카센터 ID가 올바르지 않습니다.", variant: "destructive" });
      setLoading(false);
      return;
    }
    fetchCenterDetail(centerId);
  }, [centerId, toast]);

  // ✅ [수정] 실제 API를 호출하여 데이터를 가져오는 함수
  const fetchCenterDetail = async (id: string) => {
    try {
      setLoading(true);
      // 카센터 정보와 리뷰 정보를 동시에 병렬로 요청하여 성능을 최적화합니다.
      const [centerData, reviewsData] = await Promise.all([
        carCenterApiService.getCarCenterById(id),
        carCenterApiService.getReviewsByCenterId(id)
      ]);
      setCenter(centerData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("카센터 정보 조회 실패:", error);
      toast({
        title: "데이터 로딩 실패",
        description: "카센터 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setCenter(null); // 오류 발생 시 데이터를 비웁니다.
    } finally {
      setLoading(false);
    }
  };
  
  // 견적 요청 페이지로 이동
  const handleBooking = () => {
    navigate("/estimates/create", { 
      state: { centerId: center?.centerId, centerName: center?.centerName }
    });
  };

  // 채팅 페이지로 이동
  const handleChat = () => {
    navigate("/chat", { 
      state: { type: "center", centerId: center?.centerId }
    });
  };

  // 리뷰 신고 모달 열기
  const handleReportReview = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    reportModal.open();
  };

  // 로딩 중일 때 보여줄 스켈레톤 UI
  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Card className="animate-pulse">
                <CardHeader><div className="h-8 w-1/2 bg-gray-200 rounded"></div></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </CardContent>
            </Card>
            <Card className="animate-pulse">
                <CardHeader><div className="h-6 w-1/4 bg-gray-200 rounded"></div></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-16 w-full bg-gray-200 rounded"></div>
                </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  // 데이터가 없을 때 (API 호출 실패 또는 결과 없음)
  if (!center) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface">카센터 정보를 찾을 수 없습니다</h1>
          <Button onClick={() => navigate("/centers")} className="mt-4">
            카센터 목록으로 돌아가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  // 데이터 로딩 완료 후 실제 UI
  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* 카센터 기본 정보 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-on-surface">{center.centerName}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {/* [TODO] 백엔드 DTO에 평점/리뷰 수가 추가되면 이 부분을 활성화 */}
                    <span className="font-medium text-on-surface">?</span> 
                  </div>
                  <span className="text-on-surface-variant">({reviews.length}개 리뷰)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin className="h-4 w-4" />
              <span>{center.address}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Phone className="h-4 w-4" />
              <span>{center.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock className="h-4 w-4" />
              <div className="text-sm">
                <div>운영 시간: {center.openingHours || '정보 없음'}</div>
                <div>승인 상태: {center.status === 'ACTIVE' ? '승인완료' : '승인대기'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 소개 및 기본 정보 */}
        <Card>
          <CardHeader><CardTitle className="text-on-surface">소개 및 정보</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-on-surface whitespace-pre-wrap mb-4">{center.description || '소개글이 없습니다.'}</p>
            <Separator />
            <div className="space-y-2 text-sm pt-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">사업자등록번호:{center.businessRegistrationNumber}</span>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 */}
        <Card>
          <CardHeader><CardTitle className="text-on-surface">리뷰 ({reviews.length})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.reviewId} className="border-b border-outline-variant pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-on-surface">{review.writerName}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm text-on-surface">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1" onClick={() => handleReportReview(review.reviewId)}>신고</Button>
                  </div>
                </div>
                <p className="text-on-surface mb-2">{review.content}</p>
               

                {/* 리뷰 답변 */}
                {review.reply && (
                  <div className="mt-3 p-3 bg-surface rounded-md">
                      <p className="text-sm font-semibold text-primary">사장님 답변</p>
                      <p className="text-sm text-on-surface-variant mt-1 whitespace-pre-wrap">{review.reply}</p>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-center text-on-surface-variant">작성된 리뷰가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex gap-3">
       
          <Button onClick={handleBooking} className="flex-1">
            견적 요청하기
          </Button>
        </div>
      </div>

      {/* 리뷰 신고 모달 */}
      <ReviewReportModal
        isOpen={reportModal.isOpen}
        onClose={reportModal.close}
        reviewId={selectedReviewId ? String(selectedReviewId) : ""}
      />
    </PageContainer>
  );
}