/**
 * 카센터 마이페이지 (사장님 페이지) - 최종 수정본
 */
import { useState, useEffect } from "react";
import { X, Calendar, User, Star, Settings, Info } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { ReservationManageModal } from "@/domains/centers/modals/ReservationManageModal";
import { ReviewReplyModal } from "@/domains/centers/modals/ReviewReplyModal";
import { MyEstimatesCard } from "@/domains/centers/components/MyEstimatesCard";
import { CenterInfoEditModal, CenterInfo } from "@/domains/centers/modals/CenterInfoEditModal";
import { PartCreateModal, PartCreateData } from "@/domains/centers/modals/PartCreateModal";
import carCenterApi, { ReservationResDTO, UsedPartReqDTO, Review, ReservationReqDTO } from "@/services/carCenter.api";
import { ReservationCreateModal } from "@/domains/centers/modals/ReservationCreateModal"; // ✅ import 문 주석 해제


export default function CenterMyPage() {
  // 상태 변수들
  const [reservations, setReservations] = useState<ReservationResDTO[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [todayReservationCount, setTodayReservationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservations, setSelectedReservations] = useState<number[]>([]);

  // 모달 상태
  const [centerInfoModalOpen, setCenterInfoModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationResDTO | null>(null);
  const [reviewReplyModalOpen, setReviewReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [partCreateModalOpen, setPartCreateModalOpen] = useState(false);
  const [reservationCreateModalOpen, setReservationCreateModalOpen] = useState(false);

  // 데이터 로딩 함수
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reservationsData, todayCountData, reviewsData] = await Promise.all([
        carCenterApi.getMyReservations(),
        carCenterApi.getTodayReservationCount(),
        carCenterApi.getMyReviews(),
      ]);
      setReservations(reservationsData);
      setTodayReservationCount(todayCountData);
      setReviews(reviewsData);
    } catch (e) {
      setError((e as Error).message || '데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchData();
  }, []);

  // 핸들러 함수들
  const handleReservationSelect = (id: number) => {
    setSelectedReservations(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedReservations.length === reservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map(r => r.reservationId));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedReservations.length === 0) {
      alert('삭제할 예약을 선택해주세요.');
      return;
    }
    if (window.confirm(`선택된 ${selectedReservations.length}개의 예약 내역을 정말 삭제하시겠습니까?`)) {
      try {
        await Promise.all(selectedReservations.map(id => carCenterApi.deleteReservation(id)));
        alert('선택된 예약이 삭제되었습니다.');
        setSelectedReservations([]);
        fetchData();
      } catch (e) {
        alert(`삭제 중 오류가 발생했습니다: ${(e as Error).message}`);
      }
    }
  };
  
  // ✅ [수정] 잘못된 위치에 있던 모달 코드를 삭제했습니다.

  const handlePartSubmit = async (partData: PartCreateData) => {
    try {
        const reqData: UsedPartReqDTO = {
            partName: partData.name,
            description: partData.description,
            price: partData.price,
            category: partData.category,
            compatibleCarModel: partData.compatibleModel,
        };
        await carCenterApi.createUsedPart(reqData, partData.images);
        alert('중고 부품이 성공적으로 등록되었습니다.');
        setPartCreateModalOpen(false);
        fetchData(); // 데이터 새로고침
    } catch (e) {
        alert(`부품 등록 중 오류가 발생했습니다: ${(e as Error).message}`);
    }
  };

  const handleReservationCreate = async (newReservationData: ReservationReqDTO) => {
    try {
        await carCenterApi.createReservation(newReservationData);
        alert('새로운 예약이 등록되었습니다.');
        setReservationCreateModalOpen(false);
        fetchData(); // 목록 새로고침
    } catch(e) {
        alert(`예약 등록 중 오류 발생: ${(e as Error).message}`);
    }
  };

  const handleReplySubmit = async (replyData: { reviewId: number; content: string }) => {
    try {
      await carCenterApi.createReviewReply(replyData);
      alert('답글이 성공적으로 등록되었습니다.');
      setReviewReplyModalOpen(false);
      fetchData();
    } catch (e) {
      alert(`답글 등록 중 오류가 발생했습니다: ${(e as Error).message}`);
    }
  };

  const handleInfoUpdate = async (updatedInfo: CenterInfo) => {
    try {
      await carCenterApi.updateMyInfo(updatedInfo);
      alert('카센터 정보가 수정되었습니다.');
      setCenterInfoModalOpen(false);
    } catch (e) {
      alert(`정보 수정 중 오류가 발생했습니다: ${(e as Error).message}`);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };
  
  if (loading) return <PageContainer><div>로딩 중...</div></PageContainer>;
  if (error) return <PageContainer><div className="text-red-500">오류: {error}</div></PageContainer>;

  return (
    <ProtectedRoute allowedUserTypes={["CAR_CENTER"]} fallbackMessage="카센터 운영자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">사장님 마이페이지</h1>
              <p className="text-sm text-muted-foreground">카센터를 쉽게 관리하세요</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDeleteSelected}>내역 삭제</Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setReservationCreateModalOpen(true)}>예약 추가</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setPartCreateModalOpen(true)}>부품 등록</Button>
          </div>
        </div>

        {/* 통계 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">오늘 예약</p>
                    <p className="text-2xl font-bold text-blue-600">{todayReservationCount}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-green-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">총 예약</p>
                    <p className="text-2xl font-bold text-green-600">{reservations.length}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">평균 평점</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {reviews.length > 0
                        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                        : '0.0'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 text-purple-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">후기 수</p>
                    <p className="text-2xl font-bold text-purple-600">{reviews.length}개</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* 신규 예약 관리 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">신규 예약 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4 p-3 bg-muted font-medium text-sm">
              <div className="flex items-center"><Checkbox onCheckedChange={handleSelectAll} /></div>
              <div>예약자</div><div>연락처</div><div>차량정보</div><div>예약일시</div><div>요청사항</div><div></div>
            </div>
            {reservations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                    <Info className="h-5 w-5" />
                    <span>등록된 예약이 없습니다.</span>
                </div>
            ) : (
                reservations.map((reservation) => (
                  <div key={reservation.reservationId} className="grid grid-cols-7 gap-4 p-3 border-b items-center">
                    <div className="flex items-center"><Checkbox checked={selectedReservations.includes(reservation.reservationId)} onCheckedChange={() => handleReservationSelect(reservation.reservationId)} /></div>
                    <div>{reservation.customerName}</div>
                    <div>{reservation.customerPhone}</div>
                    <div>{reservation.carInfo}</div>
                    <div>{new Date(reservation.reservationDate).toLocaleDateString()}</div>
                    <div className="truncate">{reservation.requestDetails}</div>
                    <div>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedReservation(reservation); setReservationModalOpen(true); }}>
                        관리
                        </Button>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* 내 카센터 관리 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">내 카센터 관리</CardTitle>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setCenterInfoModalOpen(true)}>정보 수정</Button>
            </div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">고객에게 보여지는 카센터 정보를 수정할 수 있습니다.</p></CardContent>
        </Card>

        
        
        <MyEstimatesCard />

        {/* 후기 관리 */}
        <Card>
          <CardHeader><CardTitle className="text-lg">후기 관리</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4 p-3 bg-muted font-medium text-sm">
              <div>내용</div><div>작성자</div><div>평점</div><div>작성일</div><div>관리</div>
            </div>
            {reviews.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                    <Info className="h-5 w-5" />
                    <span>등록된 후기가 없습니다.</span>
                </div>
            ) : (
                reviews.map((review) => (
                  <div key={review.reviewId} className="grid grid-cols-5 gap-4 p-3 border-b items-center">
                    <div className="text-sm">{review.content}</div>
                    <div>{review.writerName}</div>
                    <div className="flex">{renderStars(review.rating)}</div>
                    <div>{new Date(review.createdAt).toLocaleDateString()}</div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => { setSelectedReview(review); setReviewReplyModalOpen(true); }}>
                        답글
                      </Button>
                      <Button variant="outline" size="sm" className="bg-red-500 hover:bg-red-600 text-white">신고</Button>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* 모달들 */}
        <CenterInfoEditModal open={centerInfoModalOpen} onClose={() => setCenterInfoModalOpen(false)} onUpdate={handleInfoUpdate} />
        <ReservationManageModal
          open={reservationModalOpen}
          onClose={() => { setReservationModalOpen(false); setSelectedReservation(null); }}
          reservation={selectedReservation ? { ...selectedReservation, requestDetails: selectedReservation.requestDetails || '요청사항 없음' } : null}
          onUpdate={(updatedReservation) => { console.log('Reservation updated:', updatedReservation); fetchData(); }}
        />
        <ReviewReplyModal open={reviewReplyModalOpen} onClose={() => { setReviewReplyModalOpen(false); setSelectedReview(null); }} review={selectedReview} onSubmit={handleReplySubmit} />
        <PartCreateModal open={partCreateModalOpen} onClose={() => setPartCreateModalOpen(false)} onSubmit={handlePartSubmit} />
        
        {/* ✅ [수정] 예약 생성 모달을 올바른 위치로 옮기고 주석을 해제했습니다. */}
        <ReservationCreateModal
            open={reservationCreateModalOpen}
            onClose={() => setReservationCreateModalOpen(false)}
            onSubmit={handleReservationCreate}
        />
      </div>
      </PageContainer>
    </ProtectedRoute>
  );
}