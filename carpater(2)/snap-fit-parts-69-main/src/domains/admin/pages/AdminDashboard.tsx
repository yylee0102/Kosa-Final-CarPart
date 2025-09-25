/**
 * 관리자 대시보드
 * 
 * 이 페이지의 역할:
 * - 시스템 전체 통계 및 현황 모니터링
 * - 카센터 가입 승인 관리
 * - 공지사항 작성 및 관리
 * - 신고 접수 내역 처리
 * - 전체 서비스 운영 관리
 * 
 * 왜 필요한가:
 * - 플랫폼 전체의 건전한 운영을 위한 관리 도구
 * - 카센터 품질 관리를 통한 서비스 신뢰도 향상
 * - 사용자 안전과 만족을 위한 신고 처리 시스템
 * - 효율적인 공지사항 전달로 사용자 소통 강화
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStats from "@/domains/admin/components/AdminStats";
import AdminCenterApproval from "@/domains/admin/components/AdminCenterApproval";
import AdminNoticeManagement from "@/domains/admin/components/AdminNoticeManagement";
import AdminReportManagement from "@/domains/admin/components/AdminReportManagement";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { BarChart3, Users, MessageSquare, AlertTriangle, Settings, HelpCircle } from "lucide-react";
import CsInquiryManagementPage from "@/domains/admin/pages/CsInquiryManagementPage";
import ReviewReportManagementPage from "@/domains/admin/pages/ReviewReportManagementPage";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 12547, new: 234, centers: 89 },
    pendingCenters: { total: 34, pending: 12, approved: 22 },
    notices: { total: 15, active: 12 },
    reports: { total: 23, pending: 7, resolved: 16 }
  });

  useEffect(() => {
    // TODO: API 연결 - 관리자 대시보드 데이터 조회
    // GET /api/admin/stats
    // GET /api/admin/dashboard-overview
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // 실제 API 연결 시 구현
      console.log("관리자 대시보드 데이터 조회");
    } catch (error) {
      console.error("관리자 데이터 조회 실패:", error);
    }
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="container mx-auto px-4 py-6">
          {/* 탭 네비게이션 */}
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
            <AdminStats stats={dashboardStats} />
          </TabsContent>

          {/* 카센터 승인 관리 탭 */}
          <TabsContent value="centers">
            <AdminCenterApproval />
          </TabsContent>

          {/* 공지사항 관리 탭 */}
          <TabsContent value="notices">
            <AdminNoticeManagement />
          </TabsContent>

          {/* 신고 관리 탭 */}
          <TabsContent value="reports">
            <AdminReportManagement />
          </TabsContent>

          {/* 1:1 문의 관리 탭 */}
          <TabsContent value="cs">
            <CsInquiryManagementPage />
          </TabsContent>

          {/* 리뷰 신고 관리 탭 */}
          <TabsContent value="reviews">
            <ReviewReportManagementPage />
          </TabsContent>
        </Tabs>
      </div>
      </PageContainer>
    </ProtectedRoute>
  );
}