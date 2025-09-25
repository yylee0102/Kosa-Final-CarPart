/**
 * 견적 요청 상세 페이지 (카센터용)
 * 사용자의 견적 요청에 대한 상세 정보 조회 및 견적서 작성
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/layout/PageContainer';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Car, MapPin, FileText, User, DollarSign, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { EstimateCreateModal } from '@/domains/centers/modals/EstimateCreateModal';

interface QuoteRequestDetail {
  quoteRequestId: number;
  userId: string;
  userName: string;
  userPhone: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  preferredDate: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdDate: string;
  images?: string[];
  myEstimate?: CenterEstimate;
}

interface CenterEstimate {
  estimateId: number;
  partName: string;
  estimatedPrice: number;
  description: string;
  estimatedDate: string;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  validUntil: string;
}

export const QuoteRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quoteDetail, setQuoteDetail] = useState<QuoteRequestDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuoteRequestDetail(parseInt(id));
    }
  }, [id]);

  const loadQuoteRequestDetail = async (quoteRequestId: number) => {
    setIsLoading(true);
    try {
      // Mock data - 실제로는 API 호출: GET /api/centers/quote-requests/{id}
      const mockDetail: QuoteRequestDetail = {
        quoteRequestId: 1,
        userId: 'user001',
        userName: '김철수',
        userPhone: '010-1234-5678',
        carModel: '현대 아반떼',
        carYear: 2020,
        issueDescription: '브레이크에서 소음이 나고 진동이 느껴집니다. 브레이크 패드 교체가 필요할 것 같습니다. 특히 급제동 시 "끼익" 소리가 심하게 나며, 브레이크 페달을 밟을 때 진동이 핸들까지 전달됩니다.',
        preferredDate: '2024-01-20',
        location: '서울 강남구 테헤란로 123',
        status: 'IN_PROGRESS',
        createdDate: '2024-01-15',
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        myEstimate: undefined // 아직 견적서를 보내지 않음
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

  const handleEstimateSubmit = async (estimateData: any) => {
    try {
      // API 호출: POST /api/centers/estimates
      toast({
        title: '견적서 전송 완료',
        description: '견적서가 고객에게 전송되었습니다.'
      });
      
      // 상태 업데이트
      const newEstimate: CenterEstimate = {
        estimateId: Date.now(),
        partName: estimateData.partName,
        estimatedPrice: estimateData.estimatedPrice,
        description: estimateData.description,
        estimatedDate: estimateData.estimatedDate,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        validUntil: estimateData.validUntil
      };
      
      if (quoteDetail) {
        setQuoteDetail({ ...quoteDetail, myEstimate: newEstimate });
      }
      
      setShowEstimateModal(false);
    } catch (error) {
      toast({
        title: '전송 실패',
        description: '견적서 전송 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'SENT': return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      case 'SENT': return '전송됨';
      case 'ACCEPTED': return '수락됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedUserTypes={["카센터"]}>
        <PageContainer>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">데이터를 불러오는 중...</div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  if (!quoteDetail) {
    return (
      <ProtectedRoute allowedUserTypes={["카센터"]}>
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-lg">견적 요청을 찾을 수 없습니다.</div>
            <Button onClick={() => navigate('/center/estimates/requests')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </div>
        </PageContainer>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedUserTypes={["카센터"]}>
      <PageContainer>
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/center/estimates/requests')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold">견적 요청 상세</h1>
              <p className="text-muted-foreground">고객의 견적 요청을 확인하고 견적서를 작성하세요</p>
            </div>
          </div>

          {/* 고객 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">고객명</h3>
                  <p className="text-sm text-muted-foreground">{quoteDetail.userName}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">연락처</h3>
                  <p className="text-sm text-muted-foreground">{quoteDetail.userPhone}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">지역</h3>
                  <p className="text-sm text-muted-foreground">{quoteDetail.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <h3 className="font-medium mb-2">상태</h3>
                  <Badge className={getStatusColor(quoteDetail.status)}>
                    {getStatusText(quoteDetail.status)}
                  </Badge>
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

          {/* 내 견적서 상태 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                내 견적서 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quoteDetail.myEstimate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">견적서 전송 완료</h3>
                    <Badge className={getStatusColor(quoteDetail.myEstimate.status)}>
                      {getStatusText(quoteDetail.myEstimate.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">부품/서비스</h4>
                      <p className="text-sm text-muted-foreground">{quoteDetail.myEstimate.partName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">견적 금액</h4>
                      <p className="text-lg font-bold text-primary">
                        {quoteDetail.myEstimate.estimatedPrice.toLocaleString()}원
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">예상 작업일</h4>
                      <p className="text-sm text-muted-foreground">{quoteDetail.myEstimate.estimatedDate}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">견적 유효기간</h4>
                      <p className="text-sm text-muted-foreground">{quoteDetail.myEstimate.validUntil}까지</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">상세 설명</h4>
                    <p className="text-sm">{quoteDetail.myEstimate.description}</p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    견적서 전송일: {new Date(quoteDetail.myEstimate.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium">아직 견적서를 보내지 않았습니다</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      고객의 요청을 검토하고 견적서를 작성해보세요
                    </p>
                  </div>
                  <Button onClick={() => setShowEstimateModal(true)}>
                    견적서 작성하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 견적서 작성 모달 */}
          {quoteDetail && (
            <EstimateCreateModal
              open={showEstimateModal}
              onClose={() => setShowEstimateModal(false)}
              onSubmit={handleEstimateSubmit}
              quoteRequest={{
                quoteRequestId: quoteDetail.quoteRequestId,
                customerName: quoteDetail.userName,
                carModel: quoteDetail.carModel,
                carYear: quoteDetail.carYear,
                issueDescription: quoteDetail.issueDescription,
                preferredDate: quoteDetail.preferredDate,
                location: quoteDetail.location
              }}
            />
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};