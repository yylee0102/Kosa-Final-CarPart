import { useState, useEffect } from "react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStats from "@/domains/admin/components/AdminStats";
import AdminCenterApproval from "@/domains/admin/components/AdminCenterApproval";
import AdminReportManagement from "@/domains/admin/components/AdminReportManagement";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { BarChart3, Users, MessageSquare, AlertTriangle, HelpCircle } from "lucide-react";
import CsInquiryManagementPage from "@/domains/admin/pages/CsInquiryManagementPage";
import ReviewReportManagementPage from "@/domains/admin/pages/ReviewReportManagementPage";
import adminApiService from "@/services/admin.api"; // 👈 API 서비스 임포트
import AdminNoticeManagement from "../components/AdminNoticeManagement";

// API로부터 받아올 데이터의 타입을 정의합니다.
interface DashboardStats {
  users: { total: number; new: number; centers: number };
  pendingCenters: { total: number; pending: number; approved: number };
  notices: { total: number; active: number };
  reports: { total: number; pending: number; resolved: number };
  genderData: { male: number; female: number };
  ageData: { [key: string]: number };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // ✅ 1. 초기 상태를 null로 변경하고, 로딩 상태를 추가합니다.
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 2. useEffect에서 실제 API를 호출하도록 수정합니다.
  useEffect(() => {
    // 'dashboard' 탭이 활성화될 때만 데이터를 불러옵니다.
    if (activeTab === "dashboard") {
      fetchAdminData();
    }
  }, [activeTab]);

  const fetchAdminData = async () => {
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

      // 받아온 실제 데이터로 state를 업데이트합니다.
      setDashboardStats({
        users: { total: userCount, new: 0, centers: centerCount },
        pendingCenters: { total: pendingApprovalsCount, pending: pendingApprovalsCount, approved: 0 },
        notices: { total: 0, active: 0 },
        reports: { total: reviewReportsCount, pending: reviewReportsCount, resolved: 0 },
        genderData: genderStats,
        ageData: ageStats,
      });
    } catch (error) {
      console.error("관리자 대시보드 데이터 조회 실패:", error);
      setDashboardStats(null); // 실패 시 데이터를 null로 설정
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
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
                신고관리
              </TabsTrigger>
              <TabsTrigger value="cs" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                1:1 문의
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                리뷰 신고
              </TabsTrigger>
            </TabsList>

            {/* 대시보드 탭 */}
            <TabsContent value="dashboard">
              {/* ✅ 3. 로딩 및 에러 상태에 따라 다른 UI를 보여주도록 수정합니다. */}
              {isLoading ? (
                <div className="text-center py-20">
                  <p>📊 대시보드 데이터를 불러오는 중입니다...</p>
                </div>
              ) : dashboardStats ? (
                <AdminStats stats={dashboardStats} />
              ) : (
                <div className="text-center py-20 text-red-600">
                  <p>❗️ 대시보드 데이터를 불러오는 데 실패했습니다.</p>
                </div>
              )}
            </TabsContent>

            {/* ... (다른 탭들은 기존과 동일) ... */}
            <TabsContent value="centers">
              <AdminCenterApproval />
            </TabsContent>
            <TabsContent value="notices">
              <AdminNoticeManagement />
            </TabsContent>
            <TabsContent value="reports">
              <AdminReportManagement />
            </TabsContent>
            <TabsContent value="cs">
              <CsInquiryManagementPage />
            </TabsContent>
            <TabsContent value="reviews">
              <ReviewReportManagementPage />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}