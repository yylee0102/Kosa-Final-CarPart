import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Building, FileText, AlertTriangle, HelpCircle } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/shared/contexts/AuthContext";
import adminApiService from "@/services/admin.api";
import AdminStats from "@/domains/admin/components/AdminStats";

// ✅ API 서비스의 변경된 타입에 맞춰 인터페이스를 수정합니다.
interface DashboardStats {
  users: { total: number; new: number; centers: number; };
  pendingCenters: { total: number; pending: number; approved: number; };
  notices: { total: number; active: number; };
  reports: { total: number; pending: number; resolved: number; };
  genderData: Record<string, number>; // 👈 타입 오류 수정
  ageData: Record<string, number>;    // 👈 타입 오류 수정
}

export default function AdminMyPage() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 실제 존재하는 페이지에 맞게 메뉴 아이템을 정리합니다.
  const menuItems = [
    { icon: Building, label: "카센터 승인 관리", href: "/admin/approvals" },
    { icon: FileText, label: "공지사항 관리", href: "/admin/notices" },
    { icon: AlertTriangle, label: "리뷰 신고 관리", href: "/admin/reports" },
    { icon: HelpCircle, label: "1:1 문의 관리", href: "/admin/cs" },
  ];

  useEffect(() => {
    const fetchAllStats = async () => {
      setIsLoading(true);
      try {
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

        setDashboardStats({
          users: { total: userCount, new: 0, centers: centerCount },
          pendingCenters: { total: pendingApprovalsCount, pending: pendingApprovalsCount, approved: 0 },
          notices: { total: 0, active: 0 }, // 공지사항 카운트 API가 있다면 연결 필요
          reports: { total: reviewReportsCount, pending: reviewReportsCount, resolved: 0 },
          genderData: genderStats,
          ageData: ageStats,
        });
      } catch (error) {
        console.error("대시보드 통계 데이터를 불러오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
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
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-10"><p>📊 통계 데이터를 불러오는 중입니다...</p></div>
        ) : dashboardStats ? (
          <AdminStats stats={dashboardStats} />
        ) : (
          <div className="text-center py-10 text-red-600"><p>❗️ 통계 데이터를 불러오는 데 실패했습니다.</p></div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
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
      </div>
    </PageContainer>
  );
}