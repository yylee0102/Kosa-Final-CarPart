/**
 * 일반 사용자 마이페이지
 * 
 * 이 페이지의 역할:
 * - 일반 사용자(개인)의 개인정보 관리
 * - 차량 정보 관리
 * - 견적 요청 내역 확인
 * - 작성한 리뷰 관리
 * - 고객센터 문의 및 설정
 * 
 * 왜 필요한가:
 * - 사용자가 자신의 정보를 직접 관리할 수 있는 중앙 허브
 * - 견적 요청부터 리뷰 작성까지의 전체 이용 내역을 한 곳에서 확인
 * - 개인정보 수정, 차량 등록 등 필수 기능 제공
 */

// 일반 사용자 마이페이지 (임시)
import { useEffect, useState } from "react";
import { User, Settings, Car, FileText, MessageSquare, HelpCircle, PlusCircle } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/shared/contexts/AuthContext";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
// 새로 만든 모달과 기존 모달들을 임포트합니다.
import { MyVehicleListModal } from "@/domains/users/modals/MyVehicleListModal";
import { VehicleRegisterModal } from "@/domains/users/modals/VehicleRegisterModal";
import { QuoteRequestModal } from "@/domains/users/modals/QuoteRequestModal";
import { ProfileEditModal } from "@/domains/users/modals/ProfileEditModal";
import { useNavigate } from "react-router-dom";
import UserApiService, { UserCarReqDTO, UserCarResDTO, QuoteRequestResDTO, ReviewResDTO, CsInquiryResDTO } from '@/services/user.api';


export default function UserMyPage() {
  /// ✅ [수정] 상태 변수 정리 및 통합
const { user } = useAuth();
const navigate = useNavigate();

/// --- 데이터 상태 ---
  const [myVehicles, setMyVehicles] = useState<UserCarResDTO[]>([]);
  // ✅ [추가] 견적, 리뷰, 문의 데이터를 위한 상태
  const [myQuoteRequest, setMyQuoteRequest] = useState<QuoteRequestResDTO | null>(null);
  const [myReviews, setMyReviews] = useState<ReviewResDTO[]>([]);
  const [myInquiries, setMyInquiries] = useState<CsInquiryResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

// --- 모달 상태 ---
// '차량 목록' 모달과 '차량 등록/수정' 모달 상태를 명확히 구분
const [isVehicleListModalOpen, setIsVehicleListModalOpen] = useState(false); 
const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);

// '차량 등록/수정' 모달이 열릴 때 어떤 차량을 수정할지 저장하는 상태
const [selectedVehicle, setSelectedVehicle] = useState<UserCarResDTO | undefined>(undefined);



// ✅ 1. isLoading 상태를 올바르게 제어하는 이 함수만 남겨둡니다.
const fetchAllData = async () => {
  setIsLoading(true);
  try {
    c// 여러 API를 동시에 호출합니다.
    const [
      vehicles,
      quoteRequest,
      reviews,
      inquiries
    ] = await Promise.all([
      UserApiService.getMyVehicles(),
      UserApiService.getMyQuoteRequest(),
      UserApiService.getMyReviews(),
      UserApiService.getMyCsInquiries()
    ]);

    // 각 API 응답 결과를 상태에 저장합니다.
    setMyVehicles(vehicles);
    setMyQuoteRequest(quoteRequest);
    setMyReviews(reviews);
    setMyInquiries(inquiries);
  } catch (error) {
    console.error("마이페이지 데이터 로딩 실패:", error);
  } finally {
    // try/catch 결과와 상관없이 항상 실행되어 로딩 상태를 끝냅니다.
    setIsLoading(false);
  }
};


    

useEffect(() => {
  fetchAllData(); // ✅ 수정한 함수를 호출
}, []);

// ✅ [추가] 모달 흐름을 제어하는 핸들러 함수들

// '내 차량 관리' 메뉴 클릭 시 -> '차량 목록' 모달을 연다
const handleVehicleManagementClick = () => {
  setIsVehicleListModalOpen(true);
};

// '차량 목록' 모달에서 '새 차량 등록' 버튼 클릭 시
const handleAddNewVehicle = () => {
  setSelectedVehicle(undefined); // 새 차량이므로 수정할 차량 정보는 비운다
  setIsVehicleListModalOpen(false); // 목록 모달은 닫고
  setIsRegisterModalOpen(true);     // 등록 모달을 연다
};

// '차량 목록' 모달에서 특정 차량의 '수정' 버튼 클릭 시
const handleEditVehicle = (vehicle: UserCarResDTO) => {
  setSelectedVehicle(vehicle); // 수정할 차량 정보를 저장한다
  setIsVehicleListModalOpen(false); // 목록 모달은 닫고
  setIsRegisterModalOpen(true);     // 등록 모달을 연다
};

 

// '차량 등록/수정' 모달에서 최종 '저장' 버튼 클릭 시 (API 호출)
const handleVehicleFormSubmit = async (vehicleData: UserCarReqDTO) => { // vehicleData 타입은 UserCarReqDTO 입니다.
  try {
    if (selectedVehicle) { // selectedVehicle 정보가 있으면 '수정'
      await UserApiService.updateMyVehicle(selectedVehicle.userCarId, vehicleData);
      // toast({ title: "성공", description: "차량 정보가 수정되었습니다." });
    } else { // 정보가 없으면 '신규 등록'
      await UserApiService.createMyVehicle(vehicleData);
      // toast({ title: "성공", description: "새로운 차량이 등록되었습니다." });
    }
    setIsRegisterModalOpen(false); // 등록 모달 닫기
    fetchMyVehicles(); // 차량 목록 새로고침
  } catch (error) {
     // toast({ title: "오류", description: "차량 등록/수정에 실패했습니다.", variant: "destructive" });
     console.error("Failed to submit vehicle form:", error);
  }
};

  const menuItems = [
    { icon: User, label: "내 정보 관리", href: "/user/profile", action: () => setProfileEditModalOpen(true) },
    { icon: Car, label: "내 차량 관리", action: handleVehicleManagementClick }, 
    { icon: FileText, label: "견적 요청 내역", href: "/user/quote-requests", action: () => navigate('/user/quote-requests') },
    { icon: MessageSquare, label: "견적 완료 내역", href: "/user/completed-repairs", action: () => navigate('/user/completed-repairs') },
  ];

  

  return (
    <ProtectedRoute allowedUserTypes={["USER"]} fallbackMessage="일반 사용자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 통계 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Car className="h-4 w-4 text-blue-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">등록 차량</p>
                  <p className="text-2xl font-bold text-blue-600">{myVehicles.length}대</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-green-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">견적 요청</p>
                  {/* ✅ [수정] myQuoteRequest가 있으면 1, 없으면 0으로 표시 */}
                  <p className="text-2xl font-bold text-green-600">{myQuoteRequest ? '1건' : '0건'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 text-yellow-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">작성 리뷰</p>
                  {/* ✅ [수정] myReviews 배열의 길이로 교체 */}
                  <p className="text-2xl font-bold text-yellow-600">{myReviews.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <HelpCircle className="h-4 w-4 text-purple-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">문의 건수</p>
                  {/* ✅ [수정] myInquiries 배열의 길이로 교체 */}
                  <p className="text-2xl font-bold text-purple-600">{myInquiries.length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사용자 정보 카드 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="mt-2">일반 사용자</Badge>
              </div>
              <Button variant="outline" onClick={() => setProfileEditModalOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                정보 수정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Card 
              key={item.label} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={item.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">관리하기</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 최근 활동 */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">최근 활동</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span>현대 아반떼 헤드라이트 견적 요청</span>
                <span className="text-sm text-muted-foreground">2024.01.15</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>우리카센터 리뷰 작성</span>
                <span className="text-sm text-muted-foreground">2024.01.14</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>기아 쏘렌토 범퍼 관심상품 등록</span>
                <span className="text-sm text-muted-foreground">2024.01.13</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        {/* ✅ 4. 최종 모달 렌더링 영역 */}
        <MyVehicleListModal
          open={isVehicleListModalOpen}
          onClose={() => setIsVehicleListModalOpen(false)}
          vehicles={myVehicles}
          isLoading={isLoading}
          onAddNew={handleAddNewVehicle}
          onEdit={handleEditVehicle}
        />

        <VehicleRegisterModal
          open={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          vehicle={selectedVehicle}
          onSubmit={handleVehicleFormSubmit}
        />

        <ProfileEditModal
          open={profileEditModalOpen}
          onClose={() => setProfileEditModalOpen(false)}
          onUpdate={(profileData) => {
            console.log('Profile updated:', profileData);
          }}
        />
      
      </PageContainer>
    </ProtectedRoute>
  );
}