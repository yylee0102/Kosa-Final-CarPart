/**
 * 카센터 마이페이지 (사장님 페이지)
 * 
 * 이 페이지의 역할:
 * - 카센터 운영자의 예약 관리
 * - 고객 리뷰 확인 및 관리
 * - 카센터 정보 수정
 * - 실시간 예약 현황 파악
 * 
 * 왜 필요한가:
 * - 카센터 사장이 효율적으로 예약을 관리할 수 있는 대시보드
 * - 고객 피드백(리뷰)을 즉시 확인하고 대응 가능
 * - 일일 예약 현황을 한눈에 파악하여 운영 계획 수립
 * - 카센터 정보를 최신 상태로 유지하여 고객 만족도 향상
 */

// 카센터 마이페이지 (간소화 버전)
import { useState } from "react";
import { X, Calendar, Phone, User, Star, Settings } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { CenterInfoEditModal } from "@/domains/centers/modals/CenterInfoEditModal";
import { ReservationManageModal } from "@/domains/centers/modals/ReservationManageModal";
import { ReviewReplyModal } from "@/domains/centers/modals/ReviewReplyModal";

export default function CenterMyPage() {
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);
  const [centerInfoModalOpen, setCenterInfoModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reviewReplyModalOpen, setReviewReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // 예약 관련 타입 정의 (엔티티에 맞춤)
  interface Reservation {
    reservationId: number;
    centerId: string;
    customerName: string;
    customerPhone: string;
    carInfo: string;
    carModel: string;
    carNumber: string;
    reservationDate: string;
    reservationTime: string;
    requestDetails: string;
    serviceType: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
  }

  // 임시 예약 데이터 (실제 엔티티 구조)
  const reservations: Reservation[] = [
    {
      reservationId: 1,
      centerId: "center1",
      customerName: "이영진",
      customerPhone: "010-1234-1111",
      carInfo: "GV80",
      carModel: "GV80",
      carNumber: "12가3456",
      reservationDate: "2024-08-10",
      reservationTime: "14:00",
      requestDetails: "엔진오일 교체",
      serviceType: "엔진오일 교체",
      status: 'CONFIRMED' as const
    },
    {
      reservationId: 2,
      centerId: "center1", 
      customerName: "김철수",
      customerPhone: "010-5678-2222",
      carInfo: "K5",
      carModel: "K5",
      carNumber: "34나5678",
      reservationDate: "2024-08-10",
      reservationTime: "16:00",
      requestDetails: "타이어 4개 교체",
      serviceType: "타이어 교체",
      status: 'PENDING' as const
    },
    {
      reservationId: 3,
      centerId: "center1",
      customerName: "김태진",
      customerPhone: "010-3333-4444", 
      carInfo: "Tesla Model 3",
      carModel: "Tesla Model 3",
      carNumber: "56다7890",
      reservationDate: "2024-08-11",
      reservationTime: "10:00",
      requestDetails: "전기 점검",
      serviceType: "전기 점검",
      status: 'CONFIRMED' as const
    }
  ];

  // 리뷰 관련 타입 정의 (엔티티에 맞춤)
  interface Review {
    reviewId: number;
    centerName: string;
    writerName: string;
    rating: number;
    content: string;
    createdAt: string;
  }

  // 임시 후기 데이터 (실제 엔티티 구조)
  const reviews: Review[] = [
    {
      reviewId: 1,
      centerName: "우리카센터",
      writerName: "김민수",
      content: "친절하고 꼼꼼하게 카센터 정비를 수행해 주셨습니다",
      rating: 5,
      createdAt: "2022-09-06T00:00:00Z"
    },
    {
      reviewId: 2,
      centerName: "우리카센터",
      writerName: "최영민",
      content: "정말이지 친절하게 응대하고.",
      rating: 5,
      createdAt: "2022-09-07T00:00:00Z"
    }
  ];

  const handleReservationSelect = (id: number) => {
    setSelectedReservations(prev => 
      prev.includes(id.toString()) ? prev.filter(item => item !== id.toString()) : [...prev, id.toString()]
    );
  };

  const handleSelectAll = () => {
    if (selectedReservations.length === reservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(reservations.map(r => r.reservationId.toString()));
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
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">내역 삭제</Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">예약 추가</Button>
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
                  <p className="text-2xl font-bold text-blue-600">3건</p>
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
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-7 gap-4 p-3 bg-muted font-medium text-sm">
              <div className="flex items-center">
                <Checkbox 
                  checked={selectedReservations.length === reservations.length}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              <div>예약자</div>
              <div>연락처</div>
              <div>차량정보</div>
              <div>예약일시</div>
              <div>요청사항</div>
              <div></div>
            </div>

            {/* 예약 목록 */}
            {reservations.map((reservation) => (
              <div key={reservation.reservationId} className="grid grid-cols-7 gap-4 p-3 border-b items-center">
                <div className="flex items-center">
                  <Checkbox 
                    checked={selectedReservations.includes(reservation.reservationId.toString())}
                    onCheckedChange={() => handleReservationSelect(reservation.reservationId)}
                  />
                </div>
                <div>{reservation.customerName}</div>
                <div>{reservation.customerPhone}</div>
                <div>{reservation.carInfo}</div>
                <div>{new Date(reservation.reservationDate).toLocaleDateString()}</div>
                <div>{reservation.requestDetails}</div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setReservationModalOpen(true);
                    }}
                  >
                    관리
                  </Button>
                </div>
              </div>
            ))}

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4 gap-2">
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
            </div>
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
          <CardContent>
            <p className="text-sm text-muted-foreground">
              고객에게 보여지는 카센터 정보를 수정할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        {/* 후기 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">후기 관리</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-5 gap-4 p-3 bg-muted font-medium text-sm">
              <div>내용</div>
              <div>작성자</div>
              <div>평점</div>
              <div>작성일</div>
              <div>관리</div>
            </div>

            {/* 후기 목록 */}
            {reviews.map((review) => (
              <div key={review.reviewId} className="grid grid-cols-5 gap-4 p-3 border-b items-center">
                <div className="text-sm">{review.content}</div>
                <div>{review.writerName}</div>
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <div>{new Date(review.createdAt).toLocaleDateString()}</div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => {
                      setSelectedReview(review);
                      setReviewReplyModalOpen(true);
                    }}
                  >
                    답글
                  </Button>
                  <Button variant="outline" size="sm" className="bg-red-500 hover:bg-red-600 text-white">신고</Button>
                </div>
              </div>
            ))}

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-4 gap-2">
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
            </div>
          </CardContent>
        </Card>

        {/* 모달들 */}
        <CenterInfoEditModal
          open={centerInfoModalOpen}
          onClose={() => setCenterInfoModalOpen(false)}
          onUpdate={(updatedInfo) => {
            console.log('Center info updated:', updatedInfo);
            // 실제로는 상태 업데이트 또는 API 호출
          }}
        />

        <ReservationManageModal
          open={reservationModalOpen}
          onClose={() => {
            setReservationModalOpen(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onUpdate={(updatedReservation) => {
            console.log('Reservation updated:', updatedReservation);
            // 실제로는 상태 업데이트 또는 API 호출
          }}
        />

        <ReviewReplyModal
          open={reviewReplyModalOpen}
          onClose={() => {
            setReviewReplyModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          onSubmit={(replyData) => {
            console.log('Review reply submitted:', replyData);
            // 실제로는 API 호출
          }}
        />
      </div>
      </PageContainer>
    </ProtectedRoute>
  );
}