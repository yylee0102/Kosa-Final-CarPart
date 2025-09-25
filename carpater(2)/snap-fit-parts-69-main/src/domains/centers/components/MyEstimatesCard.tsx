/**
 * 카센터 마이페이지용 견적서 목록 카드 컴포넌트 (API 연동 버전)
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Eye, Edit, Trash2, Calendar, DollarSign, 
  User, Car, CheckCircle, XCircle, Clock
} from 'lucide-react';
import carCenterApi, { EstimateResDTO } from '@/services/carCenter.api'; // ✅ API 서비스 및 타입 임포트

// 🚨 주석: 모달들은 현재 SentEstimate 타입을 받도록 되어있어, EstimateResDTO 타입과 맞지 않을 수 있습니다.
// 추후 모달을 호출할 때 데이터를 변환하거나 모달 자체를 수정해야 합니다.
// import { EstimateDetailModal } from '../modals/EstimateDetailModal';
// import { EstimateEditModal } from '../modals/EstimateEditModal';


export const MyEstimatesCard = () => {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<EstimateResDTO[]>([]); // ✅ API 응답 타입으로 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  
  // 모달 관련 상태는 이 컴포넌트에서 제거하고, 전체보기 페이지에서 관리하는 것이 좋습니다.

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    setIsLoading(true);
    try {
      // ✅ API 호출: 내가 보낸 견적서 목록 조회
      const data = await carCenterApi.getMyEstimates();
      setEstimates(data);
    } catch (error) {
      console.error('견적서 목록 조회 실패:', error);
      toast({
        title: '견적서 목록을 불러오는데 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: EstimateResDTO['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return { Icon: CheckCircle, text: '수락됨', color: 'bg-green-100 text-green-800' };
      case 'REJECTED':
        return { Icon: XCircle, text: '거절됨', color: 'bg-red-100 text-red-800' };
      default: // PENDING
        return { Icon: Clock, text: '검토중', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            최근 보낸 견적서
          </CardTitle>
          <div className="flex gap-2">
            {/* ✅ '견적서 작성' 버튼 삭제됨 */}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = '/center/estimates/sent'} // ✅ 전체보기 페이지 경로로 수정
            >
              전체보기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">데이터를 불러오는 중...</div>
        ) : estimates.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">작성한 견적서가 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {estimates.slice(0, 3).map((estimate) => { // ✅ 최근 3개만 표시
              const statusInfo = getStatusInfo(estimate.status);
              return (
                <div key={estimate.estimateId} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={statusInfo.color}>
                        <div className="flex items-center gap-1">
                          <statusInfo.Icon className="h-3 w-3" />
                          {statusInfo.text}
                        </div>
                      </Badge>
                      <span className="text-sm text-muted-foreground">#{estimate.estimateId}</span>
                    </div>
                    {/* 미리보기에서는 상세 버튼을 제거하거나, 페이지 이동으로 변경할 수 있습니다. */}
                  </div>
                  
                  {/* 🚨 중요: 아래 customerName 등은 현재 API에 없어 임시 표시합니다. */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>요청 #{estimate.requestId} 고객</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>차량 정보 필요</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{estimate.estimatedCost.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(estimate.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground truncate">
                    <strong>설명:</strong> {estimate.details}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};