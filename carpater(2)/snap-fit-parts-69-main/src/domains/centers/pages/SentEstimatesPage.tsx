/**
 * 카센터 전송 견적서 관리 페이지 (수정/삭제 기능 연동 버전)
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar, DollarSign, User, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Car } from 'lucide-react';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import carCenterApi, { EstimateResDTO } from '@/services/carCenter.api';
import { EstimateEditModal } from '@/domains/centers/modals/EstimateEditModal'; // ✅ 수정 모달 임포트

export const SentEstimatesPage = () => {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<EstimateResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 수정 모달을 위한 상태 추가
  const [editingEstimate, setEditingEstimate] = useState<EstimateResDTO | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadSentEstimates();
  }, []);

  const loadSentEstimates = async () => {
    setIsLoading(true);
    try {
      const data = await carCenterApi.getMyEstimates();
      setEstimates(data);
    } catch (error) {
      toast({ 
        title: '견적서 목록을 불러오는데 실패했습니다.',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✅ 수정 버튼 핸들러 수정
  const handleEditEstimate = (estimate: EstimateResDTO) => {
    setEditingEstimate(estimate);
    setIsEditModalOpen(true);
  };

  const handleDeleteEstimate = async (estimateId: number) => {
    if (!window.confirm(`견적서 #${estimateId}를 정말 삭제하시겠습니까?`)) return;
    try {
      await carCenterApi.deleteEstimate(estimateId);
      toast({ title: '견적서가 삭제되었습니다.' });
      loadSentEstimates(); // ✅ 삭제 후 목록을 다시 불러옵니다.
    } catch (error) {
      toast({ 
        title: '견적서 삭제에 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetail = (estimateId: number) => {
    alert(`견적서 #${estimateId} 상세보기`);
  };

  const getStatusInfo = (status: EstimateResDTO['status']) => {
    // ... (기존과 동일)
    switch (status) {
      case 'ACCEPTED':
        return { Icon: CheckCircle, text: '수락됨', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'REJECTED':
        return { Icon: XCircle, text: '거절됨', color: 'bg-red-100 text-red-800 border-red-200' };
      default: // PENDING
        return { Icon: Clock, text: '검토중', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
  };
  
  if (isLoading) return <PageContainer><div>로딩 중...</div></PageContainer>;

  return (
    <>
      <ProtectedRoute allowedUserTypes={["CAR_CENTER"]} fallbackMessage="카센터 운영자만 접근할 수 있는 페이지입니다.">
        <PageContainer>
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">내가 쓴 견적서</h1>
            </div>
            
            <div className="space-y-4">
              {estimates.length === 0 ? (
                  <Card>
                      <CardContent className="p-12 text-center text-muted-foreground">
                          <FileText className="h-10 w-10 mx-auto mb-4" />
                          작성한 견적서가 없습니다.
                      </CardContent>
                  </Card>
              ) : (
                  estimates.map((estimate) => {
                    const statusInfo = getStatusInfo(estimate.status);
                    return (
                      <Card key={estimate.estimateId} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className={`font-normal ${statusInfo.color}`}>
                              <statusInfo.Icon className="h-3 w-3 mr-1.5" />
                              {statusInfo.text} #{estimate.estimateId}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(estimate.estimateId)}><Eye className="h-4 w-4" /></Button>
                              {estimate.status !== 'ACCEPTED' && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditEstimate(estimate)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteEstimate(estimate.estimateId)}><Trash2 className="h-4 w-4" /></Button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span>요청 #{estimate.requestId}의 고객</span></div>
                            <div className="flex items-center gap-2"><Car className="h-4 w-4 text-muted-foreground" /><span>차량 정보 필요</span></div>
                            <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><span className="font-semibold">{estimate.estimatedCost.toLocaleString()}원</span></div>
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{new Date(estimate.createdAt).toLocaleDateString()}</span></div>
                          </div>

                          <div className="mt-4 pt-4 border-t"><p className="text-sm text-muted-foreground mt-1">설명: {estimate.details}</p></div>
                        </CardContent>
                      </Card>
                    )
                  })
              )}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>

      {/* ✅ 페이지 하단에 수정 모달 렌더링 */}
      <EstimateEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        estimate={editingEstimate}
        onUpdate={() => {
          setIsEditModalOpen(false); // 모달 닫기
          loadSentEstimates(); // 목록 새로고침
        }}
      />
    </>
  );
};