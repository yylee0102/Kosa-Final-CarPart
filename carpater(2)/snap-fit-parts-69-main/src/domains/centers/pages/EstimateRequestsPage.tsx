/**
 * 카센터 견적 요청 관리 페이지
 * - 고객이 요청한 견적서 목록 조회
 * - 견적서 작성 및 전송
 * - 요청 상세 정보 확인
 * CarCenterController의 견적 요청 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, FileText, Eye, Send, Clock, User, Phone, Edit } from 'lucide-react';
import { EstimateCreateModal } from '@/domains/centers/modals/EstimateCreateModal';
import { QuoteRequestDetailModal } from '@/domains/centers/modals/QuoteRequestDetailModal';
import ProtectedRoute from '@/shared/components/ProtectedRoute';

interface QuoteRequest {
  quoteRequestId: number;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  preferredDate: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdDate: string;
  images?: string[];
}

export const EstimateRequestsPage = () => {
  const { toast } = useToast();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    loadQuoteRequests();
  }, []);

  const loadQuoteRequests = () => {
    // Mock data - 실제로는 API 호출: GET /api/car-centers/estimate-requests
    const mockRequests: QuoteRequest[] = [
      {
        quoteRequestId: 1,
        customerName: '김고객',
        customerPhone: '010-1234-5678',
        carModel: '현대 아반떼',
        carYear: 2020,
        issueDescription: '브레이크에서 소음이 나고 진동이 느껴집니다. 브레이크 패드 교체가 필요할 것 같습니다.',
        preferredDate: '2024-01-20',
        location: '서울 강남구',
        status: 'PENDING',
        createdDate: '2024-01-15',
        images: ['/placeholder.svg', '/placeholder.svg']
      },
      {
        quoteRequestId: 2,
        customerName: '이고객',
        customerPhone: '010-2345-6789',
        carModel: '기아 K5',
        carYear: 2019,
        issueDescription: '엔진오일 교체 및 정기점검을 받고 싶습니다.',
        preferredDate: '2024-01-25',
        location: '서울 서초구',
        status: 'PENDING',
        createdDate: '2024-01-14'
      },
      {
        quoteRequestId: 3,
        customerName: '박고객',
        customerPhone: '010-3456-7890',
        carModel: '현대 소나타',
        carYear: 2018,
        issueDescription: '에어컨이 제대로 작동하지 않습니다. 점검 및 수리 부탁드립니다.',
        preferredDate: '2024-01-18',
        location: '서울 마포구',
        status: 'COMPLETED',
        createdDate: '2024-01-10'
      }
    ];
    setQuoteRequests(mockRequests);
  };

  const handleCreateEstimate = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(false);
    setEstimateModalOpen(true);
  };

  const handleViewDetail = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  const handleEstimateSubmit = (estimateData: any) => {
    // API 호출: POST /api/estimates/
    console.log('Estimate submitted:', estimateData);
    
    // 요청 상태 업데이트
    setQuoteRequests(prev => 
      prev.map(req => 
        req.quoteRequestId === estimateData.quoteRequestId 
          ? { ...req, status: 'COMPLETED' as const }
          : req
      )
    );
    
    toast({ title: '견적서가 성공적으로 전송되었습니다.' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      default: return status;
    }
  };

  return (
    <ProtectedRoute allowedUserTypes={["CAR_CENTER"]} fallbackMessage="카센터 운영자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="space-y-6">
          {/* 헤더 */}
          <div>
            <h1 className="text-3xl font-bold">견적 요청 관리</h1>
            <p className="text-muted-foreground">고객의 견적 요청을 확인하고 견적서를 작성하세요</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-blue-500" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">총 요청</p>
                <p className="text-2xl font-bold text-blue-600">{quoteRequests.length}건</p>
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
                      {quoteRequests.filter(r => r.status === 'PENDING').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Edit className="h-4 w-4 text-blue-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">진행중</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {quoteRequests.filter(r => r.status === 'IN_PROGRESS').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Send className="h-4 w-4 text-green-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">완료</p>
                    <p className="text-2xl font-bold text-green-600">
                      {quoteRequests.filter(r => r.status === 'COMPLETED').length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 견적 요청 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>견적 요청 목록</CardTitle>
              <CardDescription>고객이 요청한 견적을 확인하고 견적서를 작성하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quoteRequests.map((request) => (
                  <div key={request.quoteRequestId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        {/* 기본 정보 */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{request.customerName}</span>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">#{request.quoteRequestId}</span>
                        </div>

                        {/* 차량 및 연락처 정보 */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span>{request.carModel} ({request.carYear}년)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{request.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{request.location}</span>
                          </div>
                        </div>

                        {/* 날짜 정보 */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>희망일: {request.preferredDate}</span>
                          </div>
                          <span>요청일: {request.createdDate}</span>
                        </div>

                        {/* 문제 설명 */}
                        <div>
                          <span className="text-sm font-medium">문제 설명: </span>
                          <span className="text-sm text-muted-foreground">{request.issueDescription}</span>
                        </div>

                        {/* 이미지 */}
                        {request.images && request.images.length > 0 && (
                          <div className="flex gap-2">
                            {request.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`차량 사진 ${index + 1}`}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetail(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          상세보기
                        </Button>
                        {request.status === 'PENDING' && (
                          <Button 
                            size="sm"
                            onClick={() => handleCreateEstimate(request)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            견적 작성
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 견적 요청 상세보기 모달 */}
          <QuoteRequestDetailModal
            open={detailModalOpen}
            onClose={() => {
              setDetailModalOpen(false);
              setSelectedRequest(null);
            }}
            quoteRequest={selectedRequest}
            onCreateEstimate={handleCreateEstimate}
          />

          {/* 견적서 작성 모달 */}
          <EstimateCreateModal
            open={estimateModalOpen}
            onClose={() => {
              setEstimateModalOpen(false);
              setSelectedRequest(null);
            }}
            quoteRequest={selectedRequest}
            onSubmit={handleEstimateSubmit}
          />
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
};