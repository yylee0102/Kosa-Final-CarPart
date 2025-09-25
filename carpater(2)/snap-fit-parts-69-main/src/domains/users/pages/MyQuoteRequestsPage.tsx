/**
 * 사용자 견적 요청 관리 페이지
 * - 내가 요청한 견적 조회
 * - 견적 요청 삭제
 * UserController의 견적 요청서 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Car, MapPin, FileText, Trash2, Eye } from 'lucide-react';

interface QuoteRequest {
  quoteRequestId: number;
  carModel: string;
  carYear: number;
  issueDescription: string;
  preferredDate: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdDate: string;
  estimateCount: number;
  images?: string[];
}

export const MyQuoteRequestsPage = () => {
  const { toast } = useToast();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);

  useEffect(() => {
    loadMyQuoteRequests();
  }, []);

  const loadMyQuoteRequests = () => {
    // Mock data - 실제로는 API 호출: GET /api/users/my-quote-request
    const mockQuoteRequests: QuoteRequest[] = [
      {
        quoteRequestId: 1,
        carModel: '현대 아반떼',
        carYear: 2020,
        issueDescription: '브레이크에서 소음이 나고 진동이 느껴집니다. 브레이크 패드 교체가 필요할 것 같습니다.',
        preferredDate: '2024-01-20',
        location: '서울 강남구',
        status: 'IN_PROGRESS',
        createdDate: '2024-01-15',
        estimateCount: 3,
        images: ['/placeholder.svg', '/placeholder.svg']
      },
      {
        quoteRequestId: 2,
        carModel: '기아 K5',
        carYear: 2019,
        issueDescription: '엔진오일 교체 및 정기점검을 받고 싶습니다.',
        preferredDate: '2024-01-25',
        location: '서울 서초구',
        status: 'PENDING',
        createdDate: '2024-01-14',
        estimateCount: 1
      },
      {
        quoteRequestId: 3,
        carModel: '현대 소나타',
        carYear: 2018,
        issueDescription: '에어컨이 제대로 작동하지 않습니다. 점검 및 수리 부탁드립니다.',
        preferredDate: '2024-01-18',
        location: '서울 마포구',
        status: 'COMPLETED',
        createdDate: '2024-01-10',
        estimateCount: 5
      }
    ];
    setQuoteRequests(mockQuoteRequests);
  };

  const handleDeleteQuoteRequest = (quoteRequestId: number) => {
    // API 호출: DELETE /api/users/quote-requests/{id}
    setQuoteRequests(prev => prev.filter(qr => qr.quoteRequestId !== quoteRequestId));
    toast({ title: '견적 요청이 삭제되었습니다.' });
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
    <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold">내 견적 요청</h1>
          <p className="text-muted-foreground">요청한 견적을 확인하고 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 요청</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quoteRequests.length}건</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">대기중</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quoteRequests.filter(qr => qr.status === 'PENDING').length}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quoteRequests.filter(qr => qr.status === 'IN_PROGRESS').length}건
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quoteRequests.filter(qr => qr.status === 'COMPLETED').length}건
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 견적 요청 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>견적 요청 목록</CardTitle>
            <CardDescription>요청한 견적의 진행 상황을 확인하세요</CardDescription>
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
                          <Car className="h-4 w-4" />
                          <span className="font-medium">{request.carModel} ({request.carYear}년)</span>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>견적 {request.estimateCount}개</span>
                        </div>
                      </div>

                      {/* 설명 */}
                      <div className="text-sm">
                        <span className="font-medium">증상: </span>
                        {request.issueDescription}
                      </div>

                      {/* 위치 및 날짜 */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>희망일: {request.preferredDate}</span>
                        </div>
                        <span>요청일: {request.createdDate}</span>
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
                        onClick={() => window.location.href = `/mypage/quote-requests/${request.quoteRequestId}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuoteRequest(request.quoteRequestId)}
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
      </div>
    </PageContainer>
  );
};