/**
 * 견적 요청 상세 페이지 (사용자용)
 * 특정 견적 요청의 상세 정보 조회 및 받은 견적서 목록 확인
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Car, MapPin, FileText, Users, DollarSign, Phone, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QuoteRequestDetail {
  quoteRequestId: number;
  carModel: string;
  carYear: number;
  issueDescription: string;
  preferredDate: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdDate: string;
  images?: string[];
  estimates: Estimate[];
}

interface Estimate {
  estimateId: number;
  centerId: string;
  centerName: string;
  centerPhone: string;
  partName: string;
  estimatedPrice: number;
  description: string;
  estimatedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  validUntil: string;
}

export const QuoteRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quoteDetail, setQuoteDetail] = useState<QuoteRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadQuoteRequestDetail(parseInt(id));
    }
  }, [id]);

  const loadQuoteRequestDetail = async (quoteRequestId: number) => {
    setIsLoading(true);
    try {
      // Mock data - 실제로는 API 호출: GET /api/users/quote-requests/{id}
      const mockDetail: QuoteRequestDetail = {
        quoteRequestId: 1,
        carModel: '현대 아반떼',
        carYear: 2020,
        issueDescription: '브레이크에서 소음이 나고 진동이 느껴집니다. 브레이크 패드 교체가 필요할 것 같습니다. 특히 급제동 시 "끼익" 소리가 심하게 납니다.',
        preferredDate: '2024-01-20',
        location: '서울 강남구 테헤란로 123',
        status: 'IN_PROGRESS',
        createdDate: '2024-01-15',
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        estimates: [
          {
            estimateId: 1,
            centerId: 'center001',
            centerName: '강남 카센터',
            centerPhone: '02-1234-5678',
            partName: '브레이크 패드',
            estimatedPrice: 150000,
            description: '전/후 브레이크 패드 교체 작업입니다. 고품질 부품 사용으로 안전한 주행을 보장합니다.',
            estimatedDate: '2024-01-20',
            status: 'PENDING',
            createdAt: '2024-01-16',
            validUntil: '2024-01-30'
          },
          {
            estimateId: 2,
            centerId: 'center002',
            centerName: '서초 자동차정비',
            centerPhone: '02-2345-6789',
            partName: '브레이크 시스템',
            estimatedPrice: 180000,
            description: '브레이크 패드 교체 및 디스크 연마 작업 포함. 1년 품질보증.',
            estimatedDate: '2024-01-21',
            status: 'PENDING',
            createdAt: '2024-01-16',
            validUntil: '2024-02-01'
          },
          {
            estimateId: 3,
            centerId: 'center003',
            centerName: '테헤란 모터스',
            centerPhone: '02-3456-7890',
            partName: '브레이크 전체 점검',
            estimatedPrice: 120000,
            description: '브레이크 패드만 교체하고 전체 시스템 점검을 진행합니다.',
            estimatedDate: '2024-01-19',
            status: 'PENDING',
            createdAt: '2024-01-17',
            validUntil: '2024-01-29'
          }
        ]
      };
      setQuoteDetail(mockDetail);
    } catch (error) {
      console.error('견적 요청 상세 조회 실패:', error);
      toast({
        title: '조회 실패',
        description: '견적 요청 상세 정보를 불러오는데 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptEstimate = async (estimateId: number) => {
    try {
      // API 호출: POST /api/users/estimates/{estimateId}/accept
      toast({
        title: '견적 수락',
        description: '견적이 수락되었습니다. 카센터에서 연락드릴 예정입니다.'
      });
      // 상태 업데이트
      if (quoteDetail) {
        const updatedEstimates = quoteDetail.estimates.map(est => 
          est.estimateId === estimateId ? { ...est, status: 'ACCEPTED' as const } : est
        );
        setQuoteDetail({ ...quoteDetail, estimates: updatedEstimates });
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '견적 수락 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleRejectEstimate = async (estimateId: number) => {
    try {
      // API 호출: POST /api/users/estimates/{estimateId}/reject
      toast({
        title: '견적 거절',
        description: '견적이 거절되었습니다.'
      });
      // 상태 업데이트
      if (quoteDetail) {
        const updatedEstimates = quoteDetail.estimates.map(est => 
          est.estimateId === estimateId ? { ...est, status: 'REJECTED' as const } : est
        );
        setQuoteDetail({ ...quoteDetail, estimates: updatedEstimates });
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '견적 거절 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '검토중';
      case 'ACCEPTED': return '수락됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">데이터를 불러오는 중...</div>
        </div>
      </PageContainer>
    );
  }

  if (!quoteDetail) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg">견적 요청을 찾을 수 없습니다.</div>
          <Button onClick={() => navigate('/mypage/quote-requests')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/mypage/quote-requests')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-3xl font-bold">견적 요청 상세</h1>
            <p className="text-muted-foreground">요청한 견적의 상세 정보와 받은 견적서를 확인하세요</p>
          </div>
        </div>

        {/* 견적 요청 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              견적 요청 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">차량 정보</h3>
                <p className="text-sm text-muted-foreground">
                  {quoteDetail.carModel} ({quoteDetail.carYear}년)
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">요청 일자</h3>
                <p className="text-sm text-muted-foreground">{quoteDetail.createdDate}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">희망 작업일</h3>
                <p className="text-sm text-muted-foreground">{quoteDetail.preferredDate}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">지역</h3>
                <p className="text-sm text-muted-foreground">{quoteDetail.location}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">증상 설명</h3>
              <p className="text-sm">{quoteDetail.issueDescription}</p>
            </div>

            {/* 이미지 */}
            {quoteDetail.images && quoteDetail.images.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">첨부된 사진</h3>
                <div className="flex gap-2 flex-wrap">
                  {quoteDetail.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`차량 사진 ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 받은 견적서 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              받은 견적서 ({quoteDetail.estimates.length}개)
            </CardTitle>
            <CardDescription>
              각 카센터에서 보낸 견적서를 비교하고 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quoteDetail.estimates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                아직 받은 견적서가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {quoteDetail.estimates.map((estimate) => (
                  <div key={estimate.estimateId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{estimate.centerName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {estimate.centerPhone}
                        </div>
                      </div>
                      <Badge className={getStatusColor(estimate.status)}>
                        {getStatusText(estimate.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium">부품/서비스</h4>
                        <p className="text-sm text-muted-foreground">{estimate.partName}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">견적 금액</h4>
                        <p className="text-lg font-bold text-primary">
                          {estimate.estimatedPrice.toLocaleString()}원
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">예상 작업일</h4>
                        <p className="text-sm text-muted-foreground">{estimate.estimatedDate}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">견적 유효기간</h4>
                        <p className="text-sm text-muted-foreground">{estimate.validUntil}까지</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">상세 설명</h4>
                      <p className="text-sm">{estimate.description}</p>
                    </div>

                    {estimate.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleAcceptEstimate(estimate.estimateId)}
                          className="flex-1"
                        >
                          견적 수락
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleRejectEstimate(estimate.estimateId)}
                          className="flex-1"
                        >
                          견적 거절
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};