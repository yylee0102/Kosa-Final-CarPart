import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Edit, Info, Loader2 } from 'lucide-react';
import { EstimateCreateModal } from '@/domains/centers/modals/EstimateCreateModal';
import { QuoteRequestDetailModal } from '@/domains/centers/modals/QuoteRequestDetailModal';
import carCenterApi, { QuoteRequestResDTO, EstimateReqDTO } from '@/services/carCenter.api';
// ✅ Table 관련 컴포넌트를 import 합니다.
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


interface MappedQuoteRequest {
  quoteRequestId: number;
  customerName: string;
  customerPhone: string; // 상세 모달을 위해 추가
  carModel: string;
  carYear: number;
  issueDescription: string;
  location: string;
  createdDate: string; // 상세 모달의 날짜 형식을 위해 원본 유지
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
      // ✅ PENDING 상태인 요청만 필터링 (선택사항: 필요에 따라 유지 또는 제거)
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
  
  // ✅ 상세 모달에 더 많은 정보를 전달하도록 DTO 매핑 함수를 수정합니다.
  const mapDtoToModalProps = (dto: QuoteRequestResDTO): MappedQuoteRequest => {
    return {
      quoteRequestId: dto.requestId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      carModel: dto.carModel,
      carYear: dto.carYear,
      issueDescription: dto.requestDetails,
      location: dto.address,
      createdDate: new Date(dto.createdAt).toLocaleDateString('ko-KR'), // 포맷팅된 날짜
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

  const handleEstimateSubmit = async (estimateData: EstimateReqDTO) => {
    try {
      await carCenterApi.submitEstimate(estimateData);
      toast({
        title: "전송 성공",
        description: "견적서가 성공적으로 전송되었습니다.",
      });
      setEstimateModalOpen(false);
      loadQuoteRequests();
    } catch (error) {
      console.error("견적서 전송 실패:", error);
      toast({
        title: "전송 실패",
        description: "견적서 전송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // ✅ 로딩 상태 UI를 별도로 분리하여 가독성 향상
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
              // ✅ 기존 div 목록을 Table 컴포넌트로 교체
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
                        <div className="font-medium">{request.carModel}</div>
                        <div className="text-sm text-muted-foreground">{request.carYear}년</div>
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
        quoteRequest={selectedRequest ? { // EstimateCreateModal이 요구하는 props 구조에 맞춰 전달
          quoteRequestId: selectedRequest.quoteRequestId,
          customerName: selectedRequest.customerName,
          carModel: selectedRequest.carModel,
          carYear: selectedRequest.carYear,
          issueDescription: selectedRequest.issueDescription,
          location: selectedRequest.location,
          createdDate: selectedRequest.createdDate, // ✅ 이 줄을 추가하세요!

        } : undefined}
        onSubmit={handleEstimateSubmit} 
      />
    </>
  );
};