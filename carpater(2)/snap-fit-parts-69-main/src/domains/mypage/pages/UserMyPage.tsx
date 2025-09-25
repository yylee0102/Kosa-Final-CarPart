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
import { useState } from "react";
import { User, Settings, Car, FileText, MessageSquare, HelpCircle } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/shared/contexts/AuthContext";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { VehicleRegisterModal } from "@/domains/users/modals/VehicleRegisterModal";
import { QuoteRequestModal } from "@/domains/users/modals/QuoteRequestModal";
import { ProfileEditModal } from "@/domains/users/modals/ProfileEditModal";
import { useNavigate } from "react-router-dom";

export default function UserMyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [quoteRequestModalOpen, setQuoteRequestModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);

  const menuItems = [
    { icon: User, label: "내 정보 관리", href: "/user/profile", action: () => setProfileEditModalOpen(true) },
    { icon: Car, label: "내 차량 관리", href: "/user/vehicles", action: () => setVehicleModalOpen(true) },
    { icon: FileText, label: "견적 요청 내역", href: "/user/quote-requests", action: () => navigate('/user/quote-requests') },
    { icon: MessageSquare, label: "견적 완료 내역", href: "/user/completed-repairs", action: () => navigate('/user/completed-repairs') },
  ];

  return (
    <ProtectedRoute allowedUserTypes={["개인"]} fallbackMessage="일반 사용자만 접근할 수 있는 페이지입니다.">
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
                  <p className="text-2xl font-bold text-blue-600">2대</p>
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
                  <p className="text-2xl font-bold text-green-600">3건</p>
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
                  <p className="text-2xl font-bold text-yellow-600">5개</p>
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
                  <p className="text-2xl font-bold text-purple-600">1건</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사용자 정보 카드 */}
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

        {/* 모달들 */}
        <VehicleRegisterModal
          open={vehicleModalOpen}
          onClose={() => setVehicleModalOpen(false)}
          onSubmit={(vehicleData) => {
            console.log('Vehicle registered:', vehicleData);
            // 실제로는 API 호출
          }}
        />

        <QuoteRequestModal
          open={quoteRequestModalOpen}
          onClose={() => setQuoteRequestModalOpen(false)}
          onSubmit={(requestData) => {
            console.log('Quote request submitted:', requestData);
            // 실제로는 API 호출
          }}
        />

        <ProfileEditModal
          open={profileEditModalOpen}
          onClose={() => setProfileEditModalOpen(false)}
          onUpdate={(profileData) => {
            console.log('Profile updated:', profileData);
            // 실제로는 API 호출
          }}
        />
      </div>
      </PageContainer>
    </ProtectedRoute>
  );
}