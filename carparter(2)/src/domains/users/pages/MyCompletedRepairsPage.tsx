// 파일: MyCompletedRepairsPage.tsx (repairId로 최종 수정)

import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Car, Calendar, Wrench, Trash2, Star, Info, Loader2 } from 'lucide-react';
import { ReviewWriteModal } from '@/domains/users/modals/ReviewWriteModal';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import UserApiService, { CompletedRepairResDTO, ReviewReqDTO, ReviewResDTO } from '@/services/user.api';

export default function MyCompletedRepairsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [completedRepairs, setCompletedRepairs] = useState<CompletedRepairResDTO[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<CompletedRepairResDTO | null>(null);
   const [editingReview, setEditingReview] = useState<ReviewResDTO | null>(null); 
   // ✅ 수정할 리뷰 데이터 저장용 state 추가

  useEffect(() => {
    loadMyCompletedRepairs();
  }, []);

  const loadMyCompletedRepairs = async () => {
    setIsLoading(true);
    try {
      const data = await UserApiService.getCompletedRepairs();
      setCompletedRepairs(data);
    } catch (error) {
      toast.error("수리 완료 내역을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRepair = (repairId: number) => {
    // TODO: 백엔드에 수리 내역 삭제 API 구현 후 연동 필요
    setCompletedRepairs(prev => prev.filter(repair => repair.repairId !== repairId));
    toast.success('수리 내역이 삭제되었습니다.');
  };


  // ▼▼▼ 리뷰 삭제 핸들러 함수 추가 ▼▼▼
    const handleDeleteReview = async (reviewId: number) => {
        if (!window.confirm("작성한 리뷰를 삭제하시겠습니까?")) return;
        try {
            await UserApiService.deleteReview(reviewId);
            toast.success("리뷰가 삭제되었습니다.");
            loadMyCompletedRepairs(); // 삭제 후 목록 새로고침
        } catch (error) {
            toast.error("리뷰 삭제에 실패했습니다.");
        }
    };

  // ▼▼▼ '리뷰 수정' 버튼을 위한 핸들러 함수 추가 ▼▼▼
  const handleEditReview = async (reviewId: number) => {
    try {
      // 1. user.api.ts에 추가한 함수로 기존 리뷰 데이터를 불러옵니다.
      const reviewToEdit = await UserApiService.getReviewById(reviewId);
      setEditingReview(reviewToEdit); // state에 저장
      setReviewModalOpen(true); // 모달 열기
    } catch (error) {
      toast.error("리뷰 정보를 불러오는 데 실패했습니다.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '완료';
      case 'IN_PROGRESS': return '진행중';
      default: return status;
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number') return '0원';
    return amount.toLocaleString('ko-KR') + '원';
  };
  
  const getTotalCost = () => {
    return completedRepairs.reduce((sum, repair) => sum + (repair.finalCost || 0), 0);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <ProtectedRoute allowedUserTypes={["USER"]} fallbackMessage="일반 사용자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">수리 완료 내역</h1>
            <p className="text-muted-foreground">완료된 수리 내역을 확인하고 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 수리 건수</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedRepairs.length}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 수리비용</CardTitle>
                
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(getTotalCost())}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">진행중인 수리</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedRepairs.filter(r => r.status === 'IN_PROGRESS').length}건
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">평균 수리비</CardTitle>
                
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedRepairs.length > 0 
                    ? formatCurrency(Math.round(getTotalCost() / completedRepairs.length))
                    : '0원'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>수리 내역 목록</CardTitle>
              <CardDescription>완료된 모든 수리 내역을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedRepairs.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3">
                    <Info className="h-8 w-8" />
                    <p>완료된 수리 내역이 없습니다.</p>
                  </div>
                ) : (
                  completedRepairs.map((repair) => (
                    // ▼▼▼ 1. key를 repairId로 수정 ▼▼▼
                    <div key={repair.repairId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-lg">{repair.carCenterName}</span>
                            <Badge className={getStatusColor(repair.status)}>
                              {getStatusText(repair.status)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              
                              <span className="font-medium">{formatCurrency(repair.finalCost)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              <span>{repair.carModel} ({repair.licensePlate})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>완료일: {repair.completedAt ? new Date(repair.completedAt).toLocaleDateString() : '미완료'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4" />
                              <span className="font-medium">수리 내용</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">
                              {repair.repairDetails ?? '상세 수리 내역이 없습니다.'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {repair.reviewId ? (
                        // 리뷰가 있으면 '리뷰 삭제' 버튼 표시
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => {
                                  // TODO: 리뷰 수정 모달을 여는 로직 구현
                                      // 1. 기존 리뷰 내용을 API로 불러온다.
                                      // 2. ReviewWriteModal을 열고, 불러온 내용으로 폼을 채운다.
                                      console.log(`리뷰 수정: ${repair.reviewId}`);
                                }}
                              >
                                <Star className="h-4 w-4 mr-1" />
                                리뷰 수정
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteReview(repair.reviewId!)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">리뷰 삭제</span>
                              </Button>
                              </>
                          ) : (
                            // ✅ 리뷰가 없을 경우: '리뷰 작성' 버튼만 보여줍니다.
                            <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                                setSelectedRepair(repair);
                                setReviewModalOpen(true);
                            }}
                        >
                            <Star className="h-4 w-4 mr-1" />
                            리뷰 작성
                        </Button>
                          )}

                          
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <ReviewWriteModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedRepair(null);
            setEditingReview(null);
          }}
          // ▼▼▼ onSubmit과 repairId prop 수정 ▼▼▼
            onSubmit={async (reviewData: ReviewReqDTO) => {
                try {
                    await UserApiService.createReview(reviewData);
                    toast.success("리뷰가 성공적으로 등록되었습니다.");
                    setReviewModalOpen(false);
                    setSelectedRepair(null);
                    loadMyCompletedRepairs(); // 작성 후 목록 새로고침
                } catch (error) {
                    toast.error("리뷰 등록에 실패했습니다.");
                    throw error;
                }
            }}
            repairId={selectedRepair?.repairId}
            centerName={selectedRepair?.carCenterName || editingReview?.centerName || ""}
            centerId={selectedRepair?.carCenterId || ""}
            // ✅ 수정할 리뷰 데이터를 모달에 prop으로 전달
            existingReview={editingReview} 
            />
      </PageContainer>
    </ProtectedRoute>
  );
}