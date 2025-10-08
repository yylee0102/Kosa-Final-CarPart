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
import AdminNoticeManagement from "../components/AdminNoticeManagement";

// ✅ API 서비스의 변경된 타입에 맞춰 인터페이스를 수정합니다.
interface DashboardStats {
  users: { total: number; new: number; centers: number };
  pendingCenters: { total: number; pending: number; approved: number };
  notices: { total: number; active: number };
  reports: { total: number; pending: number; resolved: number };
  genderData: Record<string, number>; // 👈 '{ male: number; female: number; }' 에서 변경
  ageData: Record<string, number>;    // 👈 [key: string] 문법을 Record로 변경하여 통일
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchAdminData();
    }
  }, [activeTab]);

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
        notices: { total: 0, active: 0 }, // 실제 공지사항 카운트 API가 있다면 연결 필요
        reports: { total: reviewReportsCount, pending: reviewReportsCount, resolved: 0 },
        genderData: genderStats, // API 응답을 그대로 전달
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
            <TabsList className="grid w-full grid-cols-5"> {/* ✅ 리뷰 신고 탭이 중복되어 5개로 수정 */}
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
            {/* ✅ AdminReportManagement이 분리되었으므로 ReviewReportManagementPage를 직접 사용 */}
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