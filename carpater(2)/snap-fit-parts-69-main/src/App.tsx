import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";

// Pages
import { EstimateManagementPage } from "./domains/centers/pages/EstimateManagementPage";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import InvestmentPage from "./pages/InvestmentPage";
import CareersPage from "./pages/CareersPage";
import WBListPage from "./domains/wb/pages/WBListPage";
import WBDetailPage from "./domains/wb/pages/WBDetailPage";
import CentersListPage from "./domains/centers/pages/CentersListPage";
import CenterDetailPage from "./domains/centers/pages/CenterDetailPage";
import SearchResultsPage from "./domains/search/pages/SearchResultsPage";
import EstimateCreatePage from "./domains/estimates/pages/EstimateCreatePage";
import EstimateDetailPage from "./domains/estimates/pages/EstimateDetailPage";
import EstimateAIPage from "./domains/estimates/pages/EstimateAIPage";
import EstimateRequestPage from "./domains/estimates/pages/EstimateRequestPage";
import CenterEstimatesPage from "./domains/centers/pages/CenterEstimatesPage";
import { EstimateRequestsPage } from "./domains/centers/pages/EstimateRequestsPage";
import CenterEstimateCreatePage from "./domains/centers/pages/EstimateCreatePage";
import { QuoteRequestDetailPage as CenterQuoteRequestDetailPage } from "./domains/centers/pages/QuoteRequestDetailPage";
import { SentEstimatesManagementPage } from "./domains/centers/pages/SentEstimatesManagementPage";
import ChatPage from "./domains/chat/pages/ChatPage";
import SupportPage from "./domains/support/pages/SupportPage";
import MyPage from "./domains/mypage/pages/MyPage";
import UserMyPage from "./domains/mypage/pages/UserMyPage";
import CenterMyPage from "./domains/centers/pages/CenterMyPage";
import AdminDashboard from "./domains/admin/pages/AdminDashboard";
import { ReservationManagementPage } from "./domains/centers/pages/ReservationManagementPage";
import { ReviewReplyManagementPage } from "./domains/centers/pages/ReviewReplyManagementPage";
import { MyQuoteRequestsPage } from "./domains/users/pages/MyQuoteRequestsPage";
import { QuoteRequestDetailPage } from "./domains/users/pages/QuoteRequestDetailPage";
import { MyReviewsPage } from "./domains/users/pages/MyReviewsPage";
import MyCompletedRepairsPage from "./domains/users/pages/MyCompletedRepairsPage";
import MyVehiclesPage from "./domains/users/pages/MyVehiclesPage"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Router>
        <Routes>
          {/* 홈페이지 */}
          <Route path="/" element={<HomePage />} />

          {/* WB (중고부품) 관련 라우트 */}
          <Route path="/wb" element={<WBListPage />} />
          <Route path="/wb/:partId" element={<WBDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          
          {/* 카센터 관련 */}
          <Route path="/centers" element={<CentersListPage />} />
          <Route path="/centers/:centerId" element={<CenterDetailPage />} />
          
          {/* 견적서 관련 */}
          <Route path="/estimates" element={<SearchResultsPage />} />
          <Route path="/estimates/create" element={<EstimateCreatePage />} />
          <Route path="/estimates/ai" element={<EstimateAIPage />} />
          <Route path="/estimates/requests" element={<EstimateRequestPage />} />
          <Route path="/estimates/center" element={<CenterEstimatesPage />} />
          <Route path="/estimates/:estimateId" element={<EstimateDetailPage />} />
          
          {/* 카센터 견적 관리 */}
          <Route path="/center/estimates" element={<EstimateManagementPage />} />
          <Route path="/center/estimates/requests" element={<EstimateRequestsPage />} />
          <Route path="/center/estimates/requests/:id" element={<CenterQuoteRequestDetailPage />} />
          <Route path="/center/estimates/create/:requestId?" element={<CenterEstimateCreatePage />} />
          <Route path="/center/estimates/sent-management" element={<SentEstimatesManagementPage />} />
          
          {/* 카센터 추가 관리 페이지 */}
          <Route path="/center/reservations" element={<ReservationManagementPage />} />
          <Route path="/center/review-replies" element={<ReviewReplyManagementPage />} />

          {/* 사용자별 마이페이지 */}
          <Route path="/user/mypage" element={<UserMyPage />} />
          <Route path="/user/quote-requests" element={<MyQuoteRequestsPage />} />
          <Route path="/user/quote-requests/:id" element={<QuoteRequestDetailPage />} />
          <Route path="/user/reviews" element={<MyReviewsPage />} />
          <Route path="/user/completed-repairs" element={<MyCompletedRepairsPage />} />
          
          {/* 고객센터 관련 */}
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/faq" element={<SupportPage />} />
          <Route path="/support/contact" element={<SupportPage />} />
          <Route path="/support/notices" element={<SupportPage />} />
          <Route path="/support/notices/:noticeId" element={<SupportPage />} />
          
          {/* 채팅 관련 */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />
          
          {/* 마이페이지 관련 - 사용자 유형별 분리 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/center/mypage" element={<CenterMyPage />} />
          <Route path="/admin/mypage" element={<MyPage />} />
          <Route path="/owner" element={<MyPage />} />
          
          {/* 관리자 관련 */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/notices" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />

          {/* 차량 관리*/}
          <Route path="/user/vehicles" element={<MyVehiclesPage />} />
          
          {/* 기타 페이지들 */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/investment" element={<InvestmentPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/terms" element={<MyPage />} />
          <Route path="/privacy" element={<MyPage />} />
          
          {/* 404 페이지 - 가장 마지막에 위치 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
