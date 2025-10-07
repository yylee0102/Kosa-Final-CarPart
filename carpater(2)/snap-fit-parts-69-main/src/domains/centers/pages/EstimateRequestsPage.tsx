/**
 * 카센터 견적 요청 관리 페이지 (최종 수정본)
 * - [수정] 부모 탭 컨테이너에 포함될 수 있도록 불필요한 헤더 및 레이아웃 제거
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, Eye, Edit, User, Info } from 'lucide-react';
import { EstimateCreateModal } from '@/domains/centers/modals/EstimateCreateModal';
import { QuoteRequestDetailModal } from '@/domains/centers/modals/QuoteRequestDetailModal';
import carCenterApi, { QuoteRequestResDTO, EstimateReqDTO, EstimateItemReqDTO } from '@/services/carCenter.api';

// 모달에 props로 넘겨주기 위한 UI 전용 타입
interface MappedQuoteRequest {
  quoteRequestId: number;
  customerName: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  location: string;
  createdDate: string;
  images?: string[];
}

export const EstimateRequestsPage = () => {
  const { toast } = useToast();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestResDTO[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MappedQuoteRequest | null>(null);
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuoteRequests();
  }, []);

  const loadQuoteRequests = async () => {
    setIsLoading(true);
    try {
      const data = await carCenterApi.getQuoteRequests();
      setQuoteRequests(data);
    } catch (error) {
      toast({ title: '견적 요청 목록을 불러오는 데 실패했습니다.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const mapDtoToModalProps = (dto: QuoteRequestResDTO): MappedQuoteRequest => {
    return {
      quoteRequestId: dto.requestId,
      customerName: dto.customerName,
      carModel: dto.userCar.carModel,
      carYear: dto.userCar.modelYear,
      issueDescription: dto.requestDetails,
      location: dto.address,
      createdDate: new Date(dto.createdAt).toLocaleDateString(),
      images: dto.imageUrls,
    };
  };

  const handleCreateEstimate = (requestDto: QuoteRequestResDTO) => {
    setSelectedRequest(mapDtoToModalProps(requestDto));
    setDetailModalOpen(false);
    setEstimateModalOpen(true);
  };

  const handleViewDetail = (requestDto: QuoteRequestResDTO) => {
    setSelectedRequest(mapDtoToModalProps(requestDto));
    setDetailModalOpen(true);
  };

  const handleEstimateSubmit = async (estimateDataFromModal: any) => {
    if (!selectedRequest) return;
    try {
      // ✅ apiPayload를 DTO 정의에 맞게 올바르게 생성합니다.
      const apiPayload: EstimateReqDTO = {
        requestId: selectedRequest.quoteRequestId,
        estimatedCost: estimateDataFromModal.totalPrice,
        details: estimateDataFromModal.description,
        
        // [문제 3 수정] DTO에 필요한 workDuration, validUntil 필드를 추가합니다.
        // 이 값들은 estimateDataFromModal 객체에 담겨있어야 합니다.
        workDuration: estimateDataFromModal.workDuration,
        validUntil: estimateDataFromModal.validUntil,
        
        // [문제 1, 2, 4 수정] estimateItems 배열을 올바른 필드와 문법으로 생성합니다.
        estimateItems: estimateDataFromModal.items.map((item: any): EstimateItemReqDTO => ({
          itemName: item.itemName,
          price: item.partPrice + item.laborCost, // 부품비 + 공임비
          requiredHours: 0, // DTO에 정의된 필수 필드 추가 (값은 임시로 0)
          partType: "부품",    // DTO에 정의된 필수 필드 추가
        })), // 올바른 괄호로 닫기
      };

      // ✅ API 호출과 toast 메시지를 정상적인 문법으로 분리합니다.
      await carCenterApi.submitEstimate(apiPayload);
      
      toast({ 
        title: '견적서가 성공적으로 전송되었습니다.' 
      });

      setEstimateModalOpen(false);
      loadQuoteRequests();

    } catch(error) {
      toast({ title: '견적서 전송에 실패했습니다.', variant: 'destructive'});
    }
  };

  // ✅ [수정] ProtectedRoute, PageContainer 및 헤더 <div>를 제거합니다.
  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>전체 견적 요청 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">데이터를 불러오는 중...</div>
            ) : quoteRequests.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
                <Info className="h-8 w-8" />
                <p className="font-medium">새로운 견적 요청이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quoteRequests.map((request) => (
                  <div key={request.requestId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2"><User className="h-4 w-4" /><span className="font-medium">{request.customerName}</span></div>
                          <span className="text-sm text-muted-foreground">#{request.requestId}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1"><Car className="h-4 w-4" /><span>{request.userCar.carModel} ({request.userCar.modelYear}년)</span></div>
                          <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{request.address}</span></div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline-block mr-1" />
                          <span>요청일: {new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm pt-2 border-t mt-2">{request.requestDetails}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetail(request)}><Eye className="h-4 w-4 mr-1" />상세보기</Button>
                        <Button size="sm" onClick={() => handleCreateEstimate(request)}><Edit className="h-4 w-4 mr-1" />견적 작성</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* 모달들 */}
      <QuoteRequestDetailModal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} quoteRequest={selectedRequest as any} onCreateEstimate={() => { /* ... */ }} />
      <EstimateCreateModal open={estimateModalOpen} onClose={() => setEstimateModalOpen(false)} quoteRequest={selectedRequest} onSubmit={handleEstimateSubmit} />
    </>
  );
};