import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Info, Loader2 } from 'lucide-react';
import { EstimateCreateModal } from '@/domains/centers/modals/EstimateCreateModal';
import { QuoteRequestDetailModal } from '@/domains/centers/modals/QuoteRequestDetailModal';
import carCenterApi, { QuoteRequestResDTO, EstimateReqDTO, EstimateItemReqDTO } from '@/services/carCenter.api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// 모달에 props로 넘겨주기 위한 UI 전용 타입
interface MappedQuoteRequest {
  quoteRequestId: number;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  location: string;
  createdDate: string;
  images?: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
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
      setQuoteRequests(data.filter(req => req.status === 'PENDING' || req.status === null));
    } catch (error) {
      toast({
        title: '오류 발생',
        description: '견적 요청 목록을 불러오는 데 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✅ [수정] return 구문이 누락된 오류를 해결했습니다.
  const mapDtoToModalProps = (dto: QuoteRequestResDTO): MappedQuoteRequest => {
    return {
      quoteRequestId: dto.requestId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      carModel: dto.userCar.carModel,
      carYear: dto.userCar.modelYear,
      issueDescription: dto.requestDetails,
      location: dto.address,
      createdDate: new Date(dto.createdAt).toLocaleDateString('ko-KR'),
      images: dto.imageUrls,
      status: dto.status,
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
  
  // ✅ [선택] 두 버전 중 더 상세하고 정확한 데이터 처리 로직을 선택했습니다.
  const handleEstimateSubmit = async (estimateDataFromModal: any) => {
    if (!selectedRequest) return;
    try {
      const apiPayload: EstimateReqDTO = {
        requestId: selectedRequest.quoteRequestId,
        estimatedCost: estimateDataFromModal.totalPrice,
        details: estimateDataFromModal.description,
        workDuration: estimateDataFromModal.workDuration,
        validUntil: estimateDataFromModal.validUntil,
        estimateItems: estimateDataFromModal.items.map((item: any): EstimateItemReqDTO => ({
          itemName: item.itemName,
          price: item.partPrice + item.laborCost,
          requiredHours: 0,
          partType: "부품",
          quantity: item.quantity, // ✅ 이 줄을 추가하면 해결됩니다.
        })),
      };

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>새로운 견적 요청</CardTitle>
          </CardHeader>
          <CardContent>
            {quoteRequests.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3">
                <Info className="h-8 w-8" />
                <p>현재 대기중인 견적 요청이 없습니다.</p>
              </div>
            ) : (
              // ✅ [선택] 더 나은 UI를 제공하는 Table 컴포넌트를 사용합니다.
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객 정보</TableHead>
                    <TableHead>차량 정보</TableHead>
                    <TableHead className="hidden md:table-cell">요청 내용</TableHead>
                    <TableHead className="text-center">요청일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quoteRequests.map((request) => (
                    <TableRow key={request.requestId}>
                      <TableCell>
                        <div className="font-medium">{request.customerName}</div>
                        <div className="text-sm text-muted-foreground">{request.customerPhone}</div>
                      </TableCell>
                      <TableCell>
                        {/* ✅ [수정] 테이블 UI에 올바른 데이터 접근 방식을 적용했습니다. */}
                        <div className="font-medium">{request.userCar?.carModel ?? '정보없음'}</div>
                        <div className="text-sm text-muted-foreground">{request.userCar?.modelYear ?? 'N/A'}년</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {request.requestDetails}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetail(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleCreateEstimate(request)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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
      
      {/* Modals */}
      <QuoteRequestDetailModal 
        open={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        quoteRequest={selectedRequest} 
        onCreateEstimate={() => { 
          if (selectedRequest) {
            const originalRequest = quoteRequests.find(q => q.requestId === selectedRequest.quoteRequestId);
            if (originalRequest) {
              handleCreateEstimate(originalRequest);
            }
          }
        }} 
      />
      <EstimateCreateModal 
        open={estimateModalOpen} 
        onClose={() => setEstimateModalOpen(false)} 
        quoteRequest={selectedRequest ? {
          quoteRequestId: selectedRequest.quoteRequestId,
          customerName: selectedRequest.customerName,
          carModel: selectedRequest.carModel,
          carYear: selectedRequest.carYear,
          issueDescription: selectedRequest.issueDescription,
          location: selectedRequest.location,
          createdDate: selectedRequest.createdDate,
        } : undefined}
        onSubmit={handleEstimateSubmit as any} 
      />
    </>
  );
};