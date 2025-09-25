/**
 * 카센터 견적 관리 통합 페이지
 * - 견적 요청 목록 조회 및 관리
 * - 내가 전송한 견적서 목록 및 관리
 * - 견적서 작성 및 수정/삭제
 */
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EstimateRequestsPage } from './EstimateRequestsPage';
import { SentEstimatesPage } from './SentEstimatesPage';
import PageContainer from '@/shared/components/layout/PageContainer';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { FileText, Send, Clock, CheckCircle } from 'lucide-react';

export const EstimateManagementPage = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <ProtectedRoute allowedUserTypes={["CAR_CENTER"]} fallbackMessage="카센터 운영자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <h1 className="text-3xl font-bold">견적 관리</h1>
            <p className="text-muted-foreground">고객의 견적 요청을 확인하고 견적서를 관리하세요</p>
          </div>

          {/* 탭 네비게이션 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="requests" className="gap-2">
                <Clock className="h-4 w-4" />
                견적 요청 관리
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Send className="h-4 w-4" />
                전송한 견적서
              </TabsTrigger>
            </TabsList>

            {/* 견적 요청 관리 탭 */}
            <TabsContent value="requests" className="space-y-0">
              <EstimateRequestsPage />
            </TabsContent>

            {/* 전송한 견적서 탭 */}
            <TabsContent value="sent" className="space-y-0">
              <SentEstimatesPage />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default EstimateManagementPage;