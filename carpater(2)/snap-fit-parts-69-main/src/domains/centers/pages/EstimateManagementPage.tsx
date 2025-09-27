/**
 * 카센터 견적 관리 통합 페이지 (최종 수정본)
 * - [수정] 파일 이름과 컴포넌트 이름 및 export 방식을 통일
 */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EstimateRequestsPage } from './EstimateRequestsPage';
import { SentEstimatesManagementPage } from './SentEstimatesManagementPage';
import PageContainer from '@/shared/components/layout/PageContainer';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { Send, Clock } from 'lucide-react';

// ✅ 파일 이름과 동일한 이름의 컴포넌트를 export 합니다.
export const EstimateManagementPage = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#sent') {
      setActiveTab('sent');
    } else {
      setActiveTab('requests');
    }
  }, [location]);

  return (
    <ProtectedRoute allowedUserTypes={["CAR_CENTER"]} fallbackMessage="카센터 운영자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">견적 관리</h1>
            <p className="text-muted-foreground">견적서 요청과 견적서를 관리하세요.</p>
          </div>
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
            <TabsContent value="requests" className="space-y-0">
              <EstimateRequestsPage />
            </TabsContent>
            <TabsContent value="sent" className="space-y-0">
              <SentEstimatesManagementPage />
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};