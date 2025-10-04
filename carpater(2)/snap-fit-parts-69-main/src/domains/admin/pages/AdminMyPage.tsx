import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Building, FileText, BarChart3, Settings } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/shared/contexts/AuthContext";
import adminApiService from "@/services/admin.api";
import AdminStats from "@/domains/admin/components/AdminStats"; // 👈 컴포넌트 경로 확인 필요

// API로부터 받아올 데이터의 타입을 백엔드 응답 형식에 맞게 정의합니다.
interface DashboardStats {
  users: { total: number; new: number; centers: number; };
  pendingCenters: { total: number; pending: number; approved: number; };
  notices: { total: number; active: number; };
  reports: { total: number; pending: number; resolved: number; };
  // ✅ genderData와 ageData의 타입을 실제 API 응답 객체 형식으로 수정
  genderData: {
    male: number;
    female: number;
  };
  ageData: {
    [ageBand: string]: number; // 예: { "20s": 15, "30s": 40, ... }
  };
}

export default function AdminMyPage() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 메뉴 아이템에 실제 링크를 연결합니다.
  const menuItems = [
    { icon: Users, label: "사용자 관리", href: "/admin/users" },
    { icon: Building, label: "카센터 승인 관리", href: "/admin/approvals" },
    { icon: FileText, label: "공지사항 관리", href: "/admin/announcements" },
    { icon: BarChart3, label: "신고 관리", href: "/admin/reports" },
    { icon: BarChart3, label: "통계 관리", href: "/admin/statistics" },
    { icon: Settings, label: "시스템 설정", href: "/admin/settings" },
  ];

  // 컴포넌트가 로드될 때 API를 호출하여 데이터를 가져옵니다.
  useEffect(() => {
    const fetchAllStats = async () => {
      setIsLoading(true);
      try {
        // Promise.all을 사용해 여러 API를 동시에 효율적으로 호출합니다.
        const [
          userCount,
          centerCount,
          pendingApprovalsCount,
          reviewReportsCount,
          genderStats,
          ageStats,
        ] = await Promise.all([
          adminApiService.getUserCount(),
          adminApiService.getCenterCount(),
          adminApiService.getPendingApprovalsCount(),
          adminApiService.getReviewReportsCount(),
          adminApiService.getGenderStats(),
          adminApiService.getAgeStats(),
        ]);

        // 받아온 데이터를 state에 저장할 형태로 가공합니다.
        setDashboardStats({
          users: { total: userCount, new: 0, centers: centerCount }, // 'new'는 예시이며, 실제 API 응답에 맞춰야 합니다.
          pendingCenters: { total: pendingApprovalsCount, pending: pendingApprovalsCount, approved: 0 },
          notices: { total: 0, active: 0 }, // 공지사항 관련 API가 추가되면 연결합니다.
          reports: { total: reviewReportsCount, pending: reviewReportsCount, resolved: 0 },
          genderData: genderStats, // API 응답 그대로 전달
          ageData: ageStats,       // API 응답 그대로 전달
        });
      } catch (error) {
        console.error("대시보드 통계 데이터를 불러오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStats();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 합니다.

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 관리자 정보 카드 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.name || "관리자"}</h2>
                <p className="text-muted-foreground">시스템 관리자</p>
                <Badge className="mt-2 bg-red-100 text-red-800">관리자</Badge>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                설정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 통계 및 차트 컴포넌트 렌더링 */}
        {isLoading ? (
          <div className="text-center py-10">
            <p>📊 통계 데이터를 불러오는 중입니다...</p>
          </div>
        ) : dashboardStats ? (
          <AdminStats stats={dashboardStats} />
        ) : (
          <div className="text-center py-10 text-red-600">
            <p>❗️ 통계 데이터를 불러오는 데 실패했습니다.</p>
          </div>
        )}

        {/* 메뉴 그리드 (Link로 감싸서 클릭 시 페이지 이동) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {menuItems.map((item) => (
            <Link to={item.href} key={item.label}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">관리하기</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 최근 활동 (이 부분도 API 연동이 필요하다면 위와 같은 방식으로 구현 가능) */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">최근 관리 활동 (임시)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span>○○카센터 승인 완료</span>
                <span className="text-sm text-muted-foreground">오늘 15:20</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>부적절한 리뷰 신고 처리 완료</span>
                <span className="text-sm text-muted-foreground">오늘 12:30</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>신규 공지사항 게시</span>
                <span className="text-sm text-muted-foreground">어제 17:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}