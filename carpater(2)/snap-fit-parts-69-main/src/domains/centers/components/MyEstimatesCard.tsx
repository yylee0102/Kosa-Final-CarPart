// src/domains/centers/components/MyEstimatesCard.tsx

import React, { useState, useEffect } from 'react';
// ✅ [추가] useNavigate를 import 합니다.
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Calendar, DollarSign, User, Car, CheckCircle, XCircle, Clock
} from 'lucide-react';
import carCenterApi, { EstimateResDTO } from '@/services/carCenter.api';

export const MyEstimatesCard = () => {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<EstimateResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // ✅ [추가] navigate 함수를 초기화합니다.

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    setIsLoading(true);
    try {
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
      // ✅ [추가] CANCELLED 상태에 대한 UI 처리
      case 'CANCELLED':
        return { Icon: XCircle, text: '취소됨', color: 'bg-gray-100 text-gray-800' };
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
            <Button 
              size="sm" 
              variant="outline"
              // ✅ [수정] onClick 핸들러를 useNavigate로 변경하고, 경로를 '/estimates'로 수정합니다.
             onClick={() => navigate('/center/estimates#sent')}
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
            {estimates.slice(0, 3).map((estimate) => {
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
                  </div>
                  
                  {/* ✅ [수정] API에서 받아온 실제 데이터로 교체합니다. */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{estimate.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{estimate.carModel} ({estimate.carYear}년)</span>
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