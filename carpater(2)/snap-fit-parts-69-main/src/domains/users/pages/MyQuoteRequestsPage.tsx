// src/pages/users/MyQuoteRequestsPage.tsx (최종 개선 버전)

import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Car, MapPin, Trash2, FileText, Plus, RefreshCw } from 'lucide-react';
import UserApiService from '@/services/user.api';
import testImage from '@/assets/test.jpg'; // S3 연동 전 임시 이미지
import { useNavigate } from 'react-router-dom';
import { EstimateDetailModal } from '@/domains/estimates/modals/EstimateDetailModal';
import { ChatApiService } from '@/services/chat.api';

// 백엔드 DTO와 일치하는 타입 (기존과 동일)
interface MyQuoteRequest {
  requestId: number;
  car: { carModel: string; modelYear: number; };
  requestDetails: string;
  address: string;
  createdAt: string;
  images: { imageUrl: string; }[];
  estimates: Estimate[];
}

interface Estimate {
  estimateId: number;
  centerName: string;
  estimatedCost: number;
  details: string;
}

export const MyQuoteRequestsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [myRequest, setMyRequest] = useState<MyQuoteRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ▼▼▼ 이 두 줄을 추가하세요 ▼▼▼
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);


  const loadMyRequest = async () => {
    setIsLoading(true);
    try {
      const data = await UserApiService.getMyQuoteRequest();
      setMyRequest(data);
    } catch (error) {
      console.error("견적 요청 정보 로딩 실패:", error);
      setMyRequest(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyRequest();
  }, []);

    // ▼▼▼ 이 함수를 새로 추가하세요 ▼▼▼
  const handleEstimateCardClick = (estimate: Estimate) => {
    setSelectedEstimate(estimate); // 클릭된 견적서 정보를 state에 저장
    setIsDetailModalOpen(true);   // 모달을 열도록 state 변경
  };



  const handleDeleteQuoteRequest = async (quoteRequestId: number) => {
    try {
      await UserApiService.deleteQuoteRequest(quoteRequestId);
      setMyRequest(null);
      toast({ title: '견적 요청이 삭제되었습니다.' });
    } catch (error) {
       toast({ title: '오류', description: '삭제에 실패했습니다.', variant: 'destructive' });
    }
  };

  // ▼▼▼ handleChatRequest 함수를 아래 코드로 교체하세요 ▼▼▼
const handleChatRequest = async (centerId: string, centerName: string) => {
    try {
        // 1. 백엔드에 채팅방 생성/조회 요청을 보내고 실제 채팅방 정보를 받아옵니다.
        const room = await ChatApiService.createOrGetChatRoom(centerId);

        // 2. 받아온 실제 채팅방 정보를 가지고 채팅 페이지로 이동합니다.
        navigate('/chat', {
            state: {
                roomId: room.roomId, // 이제 실제 DB에 있는 roomId를 전달합니다.
                centerId: centerId,
                centerName: centerName,
            }
        });
        setIsDetailModalOpen(false); // 모달 닫기
    } catch (error) {
        console.error("채팅방 입장 실패:", error);
        // TODO: 사용자에게 오류 토스트 메시지 표시
    }
};

  // 요청서가 없을 때의 화면 (AI 디자인 적용)
  const renderEmptyState = () => (
    <Card>
      <CardContent className="p-10 flex flex-col items-center justify-center text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">현재 등록된 견적 요청서가 없습니다.</h3>
        <p className="text-muted-foreground mt-2 mb-6">새로운 견적을 요청하여 여러 카센터의 제안을 받아보세요.</p>
        <Button onClick={() => navigate('/estimates/create')}>
          <Plus className="h-4 w-4 mr-2" />
          견적 요청하기
        </Button>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <PageContainer><div>로딩 중...</div></PageContainer>;
  }

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* ==================== AI 디자인 헤더 적용 ==================== */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">내 견적 요청</h1>
              <p className="text-muted-foreground">
                {myRequest ? '요청한 견적을 확인하고 카센터의 제안을 받아보세요.' : '등록된 견적 요청이 없습니다.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadMyRequest} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              {!myRequest && (
                  <Button onClick={() => navigate('/estimates/create')}> {/* TODO: 경로 확인 */}
                    <Plus className="h-4 w-4 mr-2" />
                    견적 요청
                  </Button>
              )}
            </div>
          </div>
          
          {/* ==================== AI 디자인 통계 카드 적용 ==================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">요청 상태</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{myRequest ? '견적 대기중' : '-'}</div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">받은 견적</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                  <div className="text-2xl font-bold">
                    {myRequest?.estimates?.length ?? 0} 개</div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">요청일</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">
                          {myRequest ? new Date(myRequest.createdAt).toLocaleDateString() : '-'}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* ==================== 메인 콘텐츠 (기존 로직 기반) ==================== */}
          {!myRequest ? (
            renderEmptyState()
          ) : (
            <>
              {/* 상단: 내 견적 요청 정보 */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">내가 보낸 견적 요청서</CardTitle>
                    <CardDescription>요청하신 내용의 상세 정보입니다.</CardDescription>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteQuoteRequest(myRequest.requestId)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    요청서 삭제
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2"><Car className="h-4 w-4" /><span>{myRequest.car?.carModel ?? '차량 정보 없음'} ({myRequest.car?.modelYear ?? 'N/A'}년)</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{myRequest.address}</span></div>
                  </div>
                  <div className="text-sm border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-2">요청 내용</h4>
                    <p>{myRequest.requestDetails}</p>
                  </div>
                  {myRequest.images && myRequest.images.length > 0 && (
                    <div className="flex gap-2 pt-4">
                      {myRequest.images.map((img, idx) => (
                        <img key={idx} src={testImage} alt={`차량사진 ${idx + 1} (임시)`} className="w-24 h-24 rounded object-cover" />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 하단: 받은 견적 목록 */}
              <Card>
                  <CardHeader>
                      
                      <CardTitle>받은 견적 목록 
                        ({myRequest?.estimates?.length ?? 0}개)</CardTitle>
                      <CardDescription>카센터에서 보낸 견적 제안들입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                  {/* 👇 조건 부분을 이렇게 바꿔주세요 */}
                  {(myRequest?.estimates?.length ?? 0) === 0 ? (
                    <p className="text-muted-foreground">아직 받은 견적이 없습니다.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* 👇 map 앞에도 ?. 를 붙여주세요 */}
                      {myRequest.estimates?.map((estimate) => (
                        <Card
                            key={estimate.estimateId}
                            className="group cursor-pointer hover:border-primary"
                            // 👇 이 onClick 이벤트를 추가하세요.
                            onClick={() => handleEstimateCardClick(estimate)}
                          >
                          <CardHeader><CardTitle>{estimate.centerName}</CardTitle></CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-primary mb-2">{estimate.estimatedCost.toLocaleString()}원</p>
                            {/* 상세 내용 p 태그에 line-clamp 관련 클래스를 추가합니다. */}
                            <p className="text-sm text-muted-foreground line-clamp-3 group-hover:line-clamp-none">
                              {estimate.details}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      {/* ▼▼▼ 이 모달 코드를 페이지의 가장 마지막에 추가하세요 ▼▼▼ */}
      <EstimateDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        estimate={selectedEstimate}
        centerName={selectedEstimate?.centerName || ''}
        onConfirm={(estimateId) => {
          console.log(`${estimateId}번 견적 확정!`);
          // TODO: 실제 확정 API 호출 로직 구현
          setIsDetailModalOpen(false);
        }}
        onChat={handleChatRequest}
      />
    </PageContainer>
  );
};