/**
 * 카센터 제출 견적서 관리 페이지
 * 카센터가 제출한 견적서 목록과 상태 관리
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User, 
  Car,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SentEstimate {
  estimateId: number;
  quoteRequestId: number;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: number;
  partName: string;
  estimatedPrice: number;
  description: string;
  estimatedDate: string;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  validUntil: string;
  issueDescription: string;
}

export const SentEstimatesManagementPage = () => {
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<SentEstimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSentEstimates();
  }, []);

  const loadSentEstimates = async () => {
    setIsLoading(true);
    try {
      // Mock data - 실제로는 API 호출: GET /api/centers/my-estimates
      const mockEstimates: SentEstimate[] = [
        {
          estimateId: 1,
          quoteRequestId: 101,
          customerName: '김철수',
          customerPhone: '010-1234-5678',
          carModel: '현대 아반떼',
          carYear: 2020,
          partName: '브레이크 패드',
          estimatedPrice: 150000,
          description: '전/후 브레이크 패드 교체 작업입니다. 고품질 부품 사용으로 안전한 주행을 보장합니다.',
          estimatedDate: '2024-01-20',
          status: 'ACCEPTED',
          createdAt: '2024-01-16',
          validUntil: '2024-01-30',
          issueDescription: '브레이크에서 소음이 나고 진동이 느껴집니다.'
        },
        {
          estimateId: 2,
          quoteRequestId: 102,
          customerName: '이영희',
          customerPhone: '010-2345-6789',
          carModel: '기아 K5',
          carYear: 2019,
          partName: '엔진오일',
          estimatedPrice: 80000,
          description: '고급 합성 엔진오일 교체 및 필터 교체 포함',
          estimatedDate: '2024-01-22',
          status: 'PENDING',
          createdAt: '2024-01-17',
          validUntil: '2024-02-01',
          issueDescription: '정기 엔진오일 교체가 필요합니다.'
        },
        {
          estimateId: 3,
          quoteRequestId: 103,
          customerName: '박민수',
          customerPhone: '010-3456-7890',
          carModel: '현대 소나타',
          carYear: 2018,
          partName: '에어컨 시스템',
          estimatedPrice: 250000,
          description: '에어컨 가스 충전 및 컴프레서 점검',
          estimatedDate: '2024-01-25',
          status: 'REJECTED',
          createdAt: '2024-01-15',
          validUntil: '2024-01-29',
          issueDescription: '에어컨이 제대로 작동하지 않습니다.'
        },
        {
          estimateId: 4,
          quoteRequestId: 104,
          customerName: '정수현',
          customerPhone: '010-4567-8901',
          carModel: '현대 투싼',
          carYear: 2021,
          partName: '타이어',
          estimatedPrice: 320000,
          description: '4계절 타이어 4개 교체 (245/60R18)',
          estimatedDate: '2024-01-23',
          status: 'SENT',
          createdAt: '2024-01-18',
          validUntil: '2024-02-05',
          issueDescription: '타이어 교체가 필요합니다.'
        }
      ];
      setEstimates(mockEstimates);
    } catch (error) {
      console.error('견적서 목록 조회 실패:', error);
      toast({
        title: '조회 실패',
        description: '견적서 목록을 불러오는데 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEstimate = (estimateId: number) => {
    toast({
      title: '준비 중',
      description: '견적서 수정 기능은 준비 중입니다.'
    });
  };

  const handleDeleteEstimate = async (estimateId: number) => {
    if (!confirm('견적서를 삭제하시겠습니까?')) return;
    
    try {
      // API 호출: DELETE /api/centers/estimates/{id}
      setEstimates(prev => prev.filter(est => est.estimateId !== estimateId));
      toast({
        title: '삭제 완료',
        description: '견적서가 삭제되었습니다.'
      });
    } catch (error) {
      toast({
        title: '삭제 실패',
        description: '견적서 삭제 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '검토중';
      case 'SENT': return '전송됨';
      case 'ACCEPTED': return '수락됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'SENT': return <FileText className="h-4 w-4" />;
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const totalEstimates = estimates.length;
  const acceptedCount = estimates.filter(est => est.status === 'ACCEPTED').length;
  const rejectedCount = estimates.filter(est => est.status === 'REJECTED').length;
  const pendingCount = estimates.filter(est => est.status === 'PENDING' || est.status === 'SENT').length;
  const acceptanceRate = totalEstimates > 0 ? Math.round((acceptedCount / totalEstimates) * 100) : 0;

  return (
    <ProtectedRoute allowedUserTypes={["카센터"]}>
      <PageContainer>
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <h1 className="text-3xl font-bold">제출한 견적서 관리</h1>
            <p className="text-muted-foreground">제출한 견적서의 상태를 확인하고 관리하세요</p>
          </div>

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
              {isLoading ? (
                <div className="text-center py-8">데이터를 불러오는 중...</div>
              ) : estimates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  아직 제출한 견적서가 없습니다.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>견적서 ID</TableHead>
                      <TableHead>고객 정보</TableHead>
                      <TableHead>차량 정보</TableHead>
                      <TableHead>부품/서비스</TableHead>
                      <TableHead>견적 금액</TableHead>
                      <TableHead>작업 예정일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimates.map((estimate) => (
                      <TableRow key={estimate.estimateId}>
                        <TableCell className="font-mono">#{estimate.estimateId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{estimate.customerName}</p>
                            <p className="text-sm text-muted-foreground">{estimate.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{estimate.carModel}</p>
                              <p className="text-sm text-muted-foreground">{estimate.carYear}년</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{estimate.partName}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-32">
                            {estimate.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-primary">
                            {estimate.estimatedPrice.toLocaleString()}원
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{estimate.estimatedDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(estimate.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(estimate.status)}
                              {getStatusText(estimate.status)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" title="상세보기">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {estimate.status === 'PENDING' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditEstimate(estimate.estimateId)}
                                  title="수정"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleDeleteEstimate(estimate.estimateId)}
                                  title="삭제"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};