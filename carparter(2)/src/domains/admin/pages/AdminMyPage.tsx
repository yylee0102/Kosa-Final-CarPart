/**
 * 관리자 대시보드 페이지 (수정본)
 * - [수정] 아직 구현되지 않은 공지사항 통계 관련 로직 제거
 * - [수정] 탭을 옮길 때마다 통계 데이터를 반복적으로 불러오는 비효율적인 로직 개선
 * - [수정] 컴포넌트 import 경로를 일관성 있게 별칭(alias)으로 변경
 */
import { useState, useEffect } from "react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStats from "@/domains/admin/components/AdminStats";
import AdminCenterApproval from "@/domains/admin/components/AdminCenterApproval";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { BarChart3, Users, MessageSquare, AlertTriangle, HelpCircle } from "lucide-react";
import CsInquiryManagementPage from "@/domains/admin/pages/CsInquiryManagementPage";
import ReviewReportManagementPage from "@/domains/admin/pages/ReviewReportManagementPage";
import adminApiService from "@/services/admin.api";
// ✅ [수정] import 경로를 별칭으로 통일
import AdminNoticeManagement from "@/domains/admin/components/AdminNoticeManagement";

interface DashboardStats {
  users: { total: number; new: number; centers: number };
  pendingCenters: { total: number; pending: number; approved: number };
  // notices: { total: number; active: number }; // ✅ [수정] 공지사항 통계 제거
  reports: { total: number; pending: number; resolved: number };
  genderData: Record<string, number>;
  ageData: Record<string, number>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ [수정] 탭을 옮길 때마다 데이터를 다시 불러오지 않도록, 컴포넌트가 처음 로드될 때 한 번만 실행되게 변경
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
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
        // notices: { total: 0, active: 0 }, // ✅ [수정] 공지사항 통계 제거
        reports: { total: reviewReportsCount, pending: reviewReportsCount, resolved: 0 },
        genderData: genderStats,
        ageData: ageStats,
      });
    } catch (error) {
      console.error("관리자 대시보드 데이터 조회 실패:", error);
      setDashboardStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                대시보드
              </TabsTrigger>
              <TabsTrigger value="centers" className="gap-2">
                <Users className="h-4 w-4" />
                카센터 승인
              </TabsTrigger>
              <TabsTrigger value="notices" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                공지사항
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                리뷰 신고
              </TabsTrigger>
              <TabsTrigger value="cs" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                1:1 문의
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              {isLoading ? (
                <div className="text-center py-20"><p>📊 대시보드 데이터를 불러오는 중입니다...</p></div>
              ) : dashboardStats ? (
                <AdminStats stats={dashboardStats} />
              ) : (
                <div className="text-center py-20 text-red-600"><p>❗️ 대시보드 데이터를 불러오는 데 실패했습니다.</p></div>
              )}
            </TabsContent>

            <TabsContent value="centers">
              <AdminCenterApproval />
            </TabsContent>
            <TabsContent value="notices">
              <AdminNoticeManagement />
            </TabsContent>
            <TabsContent value="reports">
              <ReviewReportManagementPage />
            </TabsContent>
            <TabsContent value="cs">
              <CsInquiryManagementPage />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}