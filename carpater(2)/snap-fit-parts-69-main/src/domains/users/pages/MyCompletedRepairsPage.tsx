/**
 * 사용자 수리 완료 내역 페이지
 * - 완료된 수리 내역 조회
 * - 수리 내역 삭제
 * UserController의 수리 완료 내역 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Car, Calendar, MapPin, Wrench, DollarSign, Trash2, FileText, Star } from 'lucide-react';
import { ReviewWriteModal } from '@/domains/users/modals/ReviewWriteModal';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

interface CompletedRepair {
  repairId: number;
  centerName: string;
  carModel: string;
  carNumber: string;
  repairDate: string;
  completedDate: string;
  repairType: string;
  repairDescription: string;
  totalCost: number;
  parts: string[];
  warranty: string;
  status: 'COMPLETED' | 'WARRANTY';
}

export default function MyCompletedRepairsPage() {
  const [completedRepairs, setCompletedRepairs] = useState<CompletedRepair[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<CompletedRepair | null>(null);

  useEffect(() => {
    loadMyCompletedRepairs();
  }, []);

  const loadMyCompletedRepairs = () => {
    // Mock data - 실제로는 API 호출: GET /api/users/my-completed-repairs
    const mockRepairs: CompletedRepair[] = [
      {
        repairId: 1,
        centerName: '신속정비 카센터',
        carModel: '현대 아반떼',
        carNumber: '12가3456',
        repairDate: '2024-01-10',
        completedDate: '2024-01-10',
        repairType: '브레이크 시스템',
        repairDescription: '브레이크 패드 교체, 브레이크 액 교환, 디스크 연마 작업',
        totalCost: 150000,
        parts: ['브레이크 패드', '브레이크 액'],
        warranty: '6개월 또는 1만 km',
        status: 'COMPLETED'
      },
      {
        repairId: 2,
        centerName: '빠른손 정비소',
        carModel: '기아 K5',
        carNumber: '34나5678',
        repairDate: '2024-01-05',
        completedDate: '2024-01-06',
        repairType: '엔진 정비',
        repairDescription: '엔진오일 교체, 에어필터 교체, 정기점검',
        totalCost: 80000,
        parts: ['엔진오일', '에어필터'],
        warranty: '3개월 또는 5천 km',
        status: 'WARRANTY'
      },
      {
        repairId: 3,
        centerName: '믿음직한 카센터',
        carModel: '현대 소나타',
        carNumber: '56다7890',
        repairDate: '2023-12-20',
        completedDate: '2023-12-21',
        repairType: '에어컨 시스템',
        repairDescription: '에어컨 가스 충전, 컴프레서 점검, 필터 교체',
        totalCost: 120000,
        parts: ['에어컨 가스', '에어컨 필터'],
        warranty: '12개월',
        status: 'COMPLETED'
      }
    ];
    setCompletedRepairs(mockRepairs);
  };

  const handleDeleteRepair = (repairId: number) => {
    // API 호출: DELETE /api/users/completed-repairs/{id}
    setCompletedRepairs(prev => prev.filter(repair => repair.repairId !== repairId));
    toast.success('수리 내역이 삭제되었습니다.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'WARRANTY': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '완료';
      case 'WARRANTY': return '보증기간';
      default: return status;
    }
  };

  const getTotalCost = () => {
    return completedRepairs.reduce((sum, repair) => sum + repair.totalCost, 0);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  return (
    <ProtectedRoute allowedUserTypes={["개인"]} fallbackMessage="일반 사용자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold">수리 완료 내역</h1>
          <p className="text-muted-foreground">완료된 수리 내역을 확인하고 관리하세요</p>
        </div>

        {/* 통계 카드 */}
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
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getTotalCost())}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">보증기간 내</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedRepairs.filter(r => r.status === 'WARRANTY').length}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 수리비</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
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

        {/* 수리 내역 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>수리 완료 내역</CardTitle>
            <CardDescription>완료된 모든 수리 내역을 확인할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedRepairs.map((repair) => (
                <div key={repair.repairId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      {/* 기본 정보 */}
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-lg">{repair.centerName}</span>
                        <Badge className={getStatusColor(repair.status)}>
                          {getStatusText(repair.status)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">{formatCurrency(repair.totalCost)}</span>
                        </div>
                      </div>

                      {/* 차량 정보 */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{repair.carModel} ({repair.carNumber})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>수리일: {repair.repairDate}</span>
                        </div>
                        <span>완료일: {repair.completedDate}</span>
                      </div>

                      {/* 수리 내용 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          <span className="font-medium">{repair.repairType}</span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {repair.repairDescription}
                        </p>
                      </div>

                      {/* 교체 부품 */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium">교체 부품:</span>
                        <div className="flex flex-wrap gap-2 pl-4">
                          {repair.parts.map((part, index) => (
                            <Badge key={index} variant="outline">
                              {part}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 보증 정보 */}
                      <div className="text-sm">
                        <span className="font-medium">보증기간: </span>
                        <span className="text-blue-600">{repair.warranty}</span>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        영수증
                      </Button>
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
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRepair(repair.repairId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 작성 모달 */}
        <ReviewWriteModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedRepair(null);
          }}
          onSubmit={(reviewData) => {
            console.log('Review submitted:', reviewData);
            // 실제로는 API 호출
            setReviewModalOpen(false);
            setSelectedRepair(null);
          }}
          centerName={selectedRepair?.centerName || ""}
          estimateId={selectedRepair?.repairId}
        />
      </div>
      </PageContainer>
    </ProtectedRoute>
  );
}