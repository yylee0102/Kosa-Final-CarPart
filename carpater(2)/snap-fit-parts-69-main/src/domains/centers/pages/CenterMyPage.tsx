/**
 * 카센터 마이페이지 (사장님 페이지) - 최종 수정본
 * [수정] 1. 관리자 승인 상태에 따른 접근 제어 로직 추가
 * [수정] 2. 등록 부품 관리 테이블의 버튼 UI 레이아웃 수정
 */
import { useState, useEffect } from "react";
import { X, Calendar, User, Star, Settings, Info, Package, Trash2, Edit, ShieldAlert } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { ReservationManageModal } from "@/domains/centers/modals/ReservationManageModal";
import { ReviewReplyModal } from "@/domains/centers/modals/ReviewReplyModal";
import { MyEstimatesCard } from "@/domains/centers/components/MyEstimatesCard";
import { CenterInfoEditModal } from "@/domains/centers/modals/CenterInfoEditModal";
import { PartCreateModal, PartCreateData } from "@/domains/centers/modals/PartCreateModal";
import carCenterApi, { ReservationResDTO, UsedPartReqDTO, Review, ReservationReqDTO, UsedPartResDTO, CarCenterUpdateRequest, CarCenterResponse } from "@/services/carCenter.api";
import { ReservationCreateModal } from "@/domains/centers/modals/ReservationCreateModal";
import { PartEditModal } from "@/domains/centers/modals/PartEditModal";

export default function CenterMyPage() {
  // 상태 변수들
  const [centerInfo, setCenterInfo] = useState<CarCenterResponse | null>(null);
  const [reservations, setReservations] = useState<ReservationResDTO[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [usedParts, setUsedParts] = useState<UsedPartResDTO[]>([]);
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
  const [partEditModalOpen, setPartEditModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<UsedPartResDTO | null>(null);

  // 데이터 로딩 함수
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [centerInfoData, reservationsData, todayCountData, reviewsData, usedPartsData] = await Promise.all([
        carCenterApi.getMyCenterInfo(),
        carCenterApi.getMyReservations(),
        carCenterApi.getTodayReservationCount(),
        carCenterApi.getMyReviews(),
        carCenterApi.getMyUsedParts(),
      ]);
      setCenterInfo(centerInfoData);
      setReservations(reservationsData);
      setTodayReservationCount(todayCountData);
      setReviews(reviewsData);
      setUsedParts(usedPartsData);
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
        fetchData();
    } catch (e) {
        alert(`부품 등록 중 오류가 발생했습니다: ${(e as Error).message}`);
    }
  };

  const handleReservationCreate = async (newReservationData: ReservationReqDTO) => {
    try {
        await carCenterApi.createReservation(newReservationData);
        alert('새로운 예약이 등록되었습니다.');
        setReservationCreateModalOpen(false);
        fetchData();
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
  
  const handlePartDelete = async (partId: number) => {
    if (window.confirm('정말로 이 부품을 삭제하시겠습니까?')) {
      try {
        await carCenterApi.deleteUsedPart(partId);
        alert('부품이 삭제되었습니다.');
        fetchData();
      } catch (e) {
        alert(`부품 삭제 중 오류가 발생했습니다: ${(e as Error).message}`);
      }
    }
  };
  
  const handlePartEdit = (part: UsedPartResDTO) => {
      setSelectedPart(part);
      setPartEditModalOpen(true);
  };

  const handleInfoUpdate = async (updatedInfo: CarCenterUpdateRequest) => {
    try {
      await carCenterApi.updateMyInfo(updatedInfo);
      alert('카센터 정보가 수정되었습니다.');
      setCenterInfoModalOpen(false);
      fetchData(); // 정보 수정 후 최신 정보 다시 불러오기
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
  
  if (loading) {
    return <PageContainer><div>로딩 중...</div></PageContainer>;
  }
  
  if (error) {
    return <PageContainer><div className="text-red-500">오류: {error}</div></PageContainer>;
  }
   console.log("서버에서 받은 카센터 정보:", centerInfo);

  // 카센터 승인 상태에 따른 접근 제어
    if (centerInfo && centerInfo.status !== 'ACTIVE') {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <Card className="p-10">
            <ShieldAlert className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {centerInfo.status === 'PENDING' ? '승인 대기 중' : '승인 거절됨'}
            </h1>
            <p className="text-muted-foreground">
              {centerInfo.status === 'PENDING' 
                ? '관리자 승인 후 마이페이지 이용이 가능합니다.' 
                : '카센터 등록이 거절되었습니다. 자세한 사항은 고객센터로 문의해주세요.'}
            </p>
          </Card>
        </div>
      </PageContainer>
    );
  }

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
              <Button size="sm" variant="destructive" onClick={handleDeleteSelected}>내역 삭제</Button>
              <Button size="sm" onClick={() => setReservationCreateModalOpen(true)}>예약 추가</Button>
              <Button size="sm" onClick={() => setPartCreateModalOpen(true)}>부품 등록</Button>
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
                <Button size="sm" onClick={() => setCenterInfoModalOpen(true)}>정보 수정</Button>
              </div>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">고객에게 보여지는 카센터 정보를 수정할 수 있습니다.</p></CardContent>
          </Card>
          
          <MyEstimatesCard />

          {/* 등록 부품 관리 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  등록 부품 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4 p-3 bg-muted font-medium text-sm">
                <div className="col-span-4">부품명</div>
                <div className="col-span-2">카테고리</div>
                <div className="col-span-3">호환 차종</div>
                <div className="col-span-1 text-right">가격</div>
                <div className="col-span-2 text-center">관리</div>
              </div>
              {usedParts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                  <Info className="h-5 w-5" />
                  <span>등록된 부품이 없습니다.</span>
                </div>
              ) : (
                usedParts.map((part) => (
                  <div key={part.partId} className="grid grid-cols-12 gap-4 p-3 border-b items-center text-sm">
                    <div className="col-span-4 font-medium">{part.partName}</div>
                    <div className="col-span-2">{part.category}</div>
                    <div className="col-span-3 truncate">{part.compatibleCarModel}</div>
                    <div className="col-span-1 text-right">{part.price.toLocaleString()}원</div>
                    <div className="col-span-2 flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePartEdit(part)}>
                          <Edit className="h-3 w-3 mr-1" />
                          수정
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handlePartDelete(part.partId)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          삭제
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

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
                        <Button variant="outline" size="sm" onClick={() => { setSelectedReview(review); setReviewReplyModalOpen(true); }}>
                          답글
                        </Button>
                        <Button variant="destructive" size="sm">신고</Button>
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
            reservation={selectedReservation}
            onUpdate={fetchData}
          />
          <ReviewReplyModal open={reviewReplyModalOpen} onClose={() => { setReviewReplyModalOpen(false); setSelectedReview(null); }} review={selectedReview} onSubmit={handleReplySubmit} />
          <PartCreateModal open={partCreateModalOpen} onClose={() => setPartCreateModalOpen(false)} onSubmit={handlePartSubmit} />
          <ReservationCreateModal
              open={reservationCreateModalOpen}
              onClose={() => setReservationCreateModalOpen(false)}
              onSubmit={handleReservationCreate}
          />
          <PartEditModal 
              open={partEditModalOpen}
              onClose={() => { setPartEditModalOpen(false); setSelectedPart(null); }}
              part={selectedPart}
              onUpdate={fetchData}
          /> 
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}