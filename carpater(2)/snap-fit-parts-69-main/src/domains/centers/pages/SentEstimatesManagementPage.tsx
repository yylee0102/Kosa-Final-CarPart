/**
 * 카센터 제출 견적서 관리 페이지 (모달 연결 최종본)
 * - 상세보기, 수정 모달 기능 연결
 * - 로딩, 에러, 데이터 없음 상태를 명확히 구분하여 UI에 표시
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  FileText, Eye, Edit, Trash2, Calendar, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, Loader2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import carCenterApi, { EstimateResDTO } from '@/services/carCenter.api';
import { EstimateEditModal } from '@/domains/centers/modals/EstimateEditModal';
// ✅ 1. 상세보기 모달을 import 합니다.
import { EstimateDetailModal } from '@/domains/centers/modals/EstimateDetailModal';


export const SentEstimatesManagementPage = () => {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<EstimateResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 수정 모달 상태
  const [editingEstimate, setEditingEstimate] = useState<EstimateResDTO | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // ✅ 2. 상세보기 모달 상태를 추가합니다.
  const [viewingEstimate, setViewingEstimate] = useState<EstimateResDTO | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadSentEstimates();
  }, []);

  const loadSentEstimates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await carCenterApi.getMyEstimates();
      setEstimates(data);
    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast({
        title: '견적서 목록을 불러오는데 실패했습니다.',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✅ 3. 상세보기 버튼 클릭 시 실행될 핸들러 함수를 추가합니다.
  const handleViewDetails = (estimate: EstimateResDTO) => {
    setViewingEstimate(estimate);
    setIsDetailModalOpen(true);
  };

  const handleEditEstimate = (estimate: EstimateResDTO) => {
    setEditingEstimate(estimate);
    setIsEditModalOpen(true);
  };

  const handleDeleteEstimate = async (estimateId: number) => {
    // window.confirm은 브라우저 기본 UI이므로, 더 나은 UX를 위해 커스텀 모달 사용을 권장합니다.
    if (!window.confirm(`견적서 #${estimateId}를 정말 삭제하시겠습니까?`)) return;
    try {
      await carCenterApi.deleteEstimate(estimateId);
      toast({ title: '견적서가 삭제되었습니다.' });
      loadSentEstimates(); // 목록 새로고침
    } catch (error) {
      toast({
        title: '견적서 삭제에 실패했습니다.',
        description: (error as Error).message,
        variant: 'destructive'
      });
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

  const totalEstimates = estimates.length;
  const acceptedCount = estimates.filter(est => est.status === 'ACCEPTED').length;
  const pendingCount = estimates.filter(est => est.status === 'PENDING').length;
  const acceptanceRate = totalEstimates > 0 ? Math.round((acceptedCount / totalEstimates) * 100) : 0;

  // 로딩 및 에러 상태에 따른 UI 분기 처리
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-lg">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="mt-4 font-semibold text-destructive">오류가 발생했습니다</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadSentEstimates} className="mt-4">다시 시도</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 견적서</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEstimates}건</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">수락된 견적</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{acceptedCount}건</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">대기/검토중</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{pendingCount}건</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">수락률</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{acceptanceRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* 견적서 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>견적서 목록</CardTitle>
            <CardDescription>제출한 견적서의 상태를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            {estimates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                아직 제출한 견적서가 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>견적서 ID</TableHead>
                    <TableHead>고객/차량 정보</TableHead>
                    <TableHead>견적 금액</TableHead>
                    <TableHead>제출일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimates.map((estimate) => {
                    const statusInfo = getStatusInfo(estimate.status);
                    return (
                      <TableRow key={estimate.estimateId}>
                        <TableCell className="font-mono">#{estimate.estimateId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{estimate.customerName}</p>
                            <p className="text-sm text-muted-foreground">{estimate.carModel} ({estimate.carYear}년)</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-primary">
                            {estimate.estimatedCost.toLocaleString()}원
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{new Date(estimate.createdAt).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusInfo.color}>
                            <div className="flex items-center gap-1">
                              <statusInfo.Icon className="h-4 w-4" />
                              {statusInfo.text}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* ✅ 4. 상세보기 버튼에 onClick 이벤트를 연결합니다. */}
                            <Button size="sm" variant="outline" title="상세보기" onClick={() => handleViewDetails(estimate)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {estimate.status !== 'ACCEPTED' && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleEditEstimate(estimate)} title="수정">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteEstimate(estimate.estimateId)} title="삭제">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 수정 모달 렌더링 */}
      {editingEstimate && (
          <EstimateEditModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            estimate={editingEstimate}
            onUpdate={() => {
              setIsEditModalOpen(false);
              loadSentEstimates();
            }}
          />
      )}
      
      {/* ✅ 5. 상세보기 모달을 렌더링하고, 상태와 함수를 props로 전달합니다. */}
      {viewingEstimate && (
        <EstimateDetailModal
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          estimate={viewingEstimate}
        />
      )}
    </>
  );
};
