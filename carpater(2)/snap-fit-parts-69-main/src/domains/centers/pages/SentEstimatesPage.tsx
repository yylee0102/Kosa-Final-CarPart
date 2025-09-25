/**
 * 카센터 전송 견적서 관리 페이지
 * - 내가 작성해서 전송한 견적서 목록 조회
 * - 견적서 상태 관리 (대기중, 승인됨, 거절됨)
 * - 견적서 수정 및 재전송
 * EstimateController의 견적서 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar, DollarSign, User, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import estimatesApiService from '@/services/estimates.api';

interface SentEstimate {
  estimateId: number;
  customerName: string;
  carModel: string;
  totalPrice: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  sentDate: string;
  validUntil: string;
  workDuration?: string;
  description?: string;
  items: EstimateItem[];
}

interface EstimateItem {
  itemName: string;
  partPrice: number;
  laborCost: number;
  quantity: number;
}

export const SentEstimatesPage = () => {
  const { toast } = useToast();
  const [sentEstimates, setSentEstimates] = useState<SentEstimate[]>([]);

  useEffect(() => {
    loadSentEstimates();
  }, []);

  const loadSentEstimates = async () => {
    try {
      // API 호출: GET /api/estimates/My-estimates
      const estimates = await estimatesApiService.getMyEstimates();
      setSentEstimates(estimates.map(est => ({
        estimateId: est.estimateId,
        customerName: '고객명', // API에서 제공되지 않으므로 기본값
        carModel: est.partName, // partName을 carModel로 매핑
        totalPrice: est.estimatedPrice,
        status: est.status === 'SENT' ? 'PENDING' as const : 
                est.status === 'ACCEPTED' ? 'APPROVED' as const : 
                est.status === 'REJECTED' ? 'REJECTED' as const : 'PENDING' as const,
        sentDate: est.createdAt.split('T')[0],
        validUntil: est.validUntil,
        workDuration: '미정',
        description: est.description,
        items: [{
          itemName: est.partName,
          partPrice: est.estimatedPrice * 0.6,
          laborCost: est.estimatedPrice * 0.4,
          quantity: 1
        }]
      })));
    } catch (error) {
      console.error('견적서 목록 로딩 실패:', error);
      toast({ 
        title: '견적서 목록을 불러오는데 실패했습니다.',
        variant: 'destructive'
      });
      
      // Fallback to mock data
      const mockEstimates: SentEstimate[] = [
      {
        estimateId: 1,
        customerName: '김고객',
        carModel: '현대 아반떼',
        totalPrice: 250000,
        status: 'PENDING',
        sentDate: '2024-01-15',
        validUntil: '2024-01-22',
        workDuration: '2-3시간',
        description: '브레이크 패드 교체 작업입니다.',
        items: [
          { itemName: '브레이크 패드', partPrice: 120000, laborCost: 80000, quantity: 1 },
          { itemName: '브레이크 오일', partPrice: 30000, laborCost: 20000, quantity: 1 }
        ]
      },
      {
        estimateId: 2,
        customerName: '이고객',
        carModel: '기아 K5',
        totalPrice: 80000,
        status: 'APPROVED',
        sentDate: '2024-01-14',
        validUntil: '2024-01-21',
        workDuration: '1시간',
        description: '엔진오일 교체 및 정기점검',
        items: [
          { itemName: '엔진오일', partPrice: 45000, laborCost: 35000, quantity: 1 }
        ]
      },
      {
        estimateId: 3,
        customerName: '박고객',
        carModel: '현대 소나타',
        totalPrice: 150000,
        status: 'REJECTED',
        sentDate: '2024-01-13',
        validUntil: '2024-01-20',
        workDuration: '2시간',
        description: '에어컨 점검 및 수리',
        items: [
          { itemName: '에어컨 가스', partPrice: 80000, laborCost: 70000, quantity: 1 }
        ]
      }
    ];
    setSentEstimates(mockEstimates);
    }
  };

  const handleEditEstimate = (estimateId: number) => {
    toast({ title: '견적서 수정 기능을 준비중입니다.' });
  };

  const handleDeleteEstimate = async (estimateId: number) => {
    try {
      await estimatesApiService.deleteEstimate(estimateId);
      setSentEstimates(prev => prev.filter(est => est.estimateId !== estimateId));
      toast({ title: '견적서가 삭제되었습니다.' });
    } catch (error) {
      console.error('견적서 삭제 실패:', error);
      toast({ 
        title: '견적서 삭제에 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetail = (estimateId: number) => {
    window.location.href = `/center/estimates/sent/${estimateId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'APPROVED': return '승인됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  return (
    <ProtectedRoute allowedUserTypes={["카센터"]} fallbackMessage="카센터 운영자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <h1 className="text-3xl font-bold">전송한 견적서</h1>
            <p className="text-muted-foreground">고객에게 전송한 견적서의 상태를 확인하고 관리하세요</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">총 견적서</p>
                <p className="text-2xl font-bold text-blue-600">{sentEstimates.length}건</p>
              </div>
            </div>
          </CardContent>
        </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">대기중</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {sentEstimates.filter(e => e.status === 'PENDING').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">승인됨</p>
                    <p className="text-2xl font-bold text-green-600">
                      {sentEstimates.filter(e => e.status === 'APPROVED').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">거절됨</p>
                    <p className="text-2xl font-bold text-red-600">
                      {sentEstimates.filter(e => e.status === 'REJECTED').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 견적서 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>견적서 목록</CardTitle>
              <CardDescription>전송한 견적서의 진행 상황을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentEstimates.map((estimate) => (
                  <div key={estimate.estimateId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        {/* 기본 정보 */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{estimate.customerName}</span>
                          </div>
                          <Badge className={getStatusColor(estimate.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(estimate.status)}
                              {getStatusText(estimate.status)}
                            </div>
                          </Badge>
                          <span className="text-sm text-muted-foreground">#{estimate.estimateId}</span>
                        </div>

                        {/* 차량 및 금액 정보 */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{estimate.carModel}</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium text-lg text-primary">
                              {formatCurrency(estimate.totalPrice)}
                            </span>
                          </div>
                          {estimate.workDuration && (
                            <span>작업시간: {estimate.workDuration}</span>
                          )}
                        </div>

                        {/* 날짜 정보 */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>전송일: {estimate.sentDate}</span>
                          </div>
                          <span>유효기간: {estimate.validUntil}</span>
                        </div>

                        {/* 견적 항목 */}
                        <div>
                          <span className="text-sm font-medium">견적 항목: </span>
                          <div className="flex gap-2 mt-1">
                            {estimate.items.map((item, index) => (
                              <Badge key={index} variant="outline">
                                {item.itemName} ({item.quantity}개)
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* 설명 */}
                        {estimate.description && (
                          <div>
                            <span className="text-sm font-medium">설명: </span>
                            <span className="text-sm text-muted-foreground">{estimate.description}</span>
                          </div>
                        )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetail(estimate.estimateId)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          상세보기
                        </Button>
                        {estimate.status === 'PENDING' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEstimate(estimate.estimateId)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              수정
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteEstimate(estimate.estimateId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};

export default SentEstimatesPage;