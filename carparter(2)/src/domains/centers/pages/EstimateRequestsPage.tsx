/**
 * 카센터 견적 요청 관리 페이지 (최종 수정본)
 * - [수정] 부모 탭 컨테이너에 포함될 수 있도록 불필요한 헤더 및 레이아웃 제거
 * - [수정] 백엔드 DTO 구조 변경에 따라 request.userCar.carModel, request.userCar.modelYear로 접근 방식 수정
 * - [수정] QuoteRequestDetailModal에 필요한 customerPhone, status 속성 추가
 * - [수정] TypeScript 타입 오류 및 import 구문 수정
 */
import React, { useState, useEffect } from 'react'; // [수정 1] 올바른 import 구문
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, Eye, Edit, User, Info } from 'lucide-react';
import { EstimateCreateModal } from '@/domains/centers/modals/EstimateCreateModal';
import { QuoteRequestDetailModal } from '@/domains/centers/modals/QuoteRequestDetailModal';
import carCenterApi, { EstimateReqDTO, EstimateItemReqDTO } from '@/services/carCenter.api';

// [수정 2] status에 대한 구체적인 타입 정의
type QuoteStatus = "PENDING" |  "COMPLETED" ; // 필요한 상태 값들

// API 응답 DTO 타입 (컴포넌트 내에서 구체화)
interface QuoteRequestResDTO {
  requestId: number;
  customerName: string;
  customerPhone: string;
  status: QuoteStatus; // 타입을 string 대신 QuoteStatus로 지정
  userCar: {
    carModel: string;
    modelYear: number;
  };
  requestDetails: string;
  address: string;
  createdAt: string; // ISO 8601 형식의 날짜 문자열
  imageUrls?: string[];
}

// 모달에 props로 넘겨주기 위한 UI 전용 타입
interface MappedQuoteRequest {
  quoteRequestId: number;
  customerName: string;
  customerPhone: string;
  status: QuoteStatus; // 타입을 string 대신 QuoteStatus로 지정
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
  const [isLoading, setIsLoading] = useState(true);
  
  // [개선] 객체 대신 ID로 상태 관리
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [estimateModalOpen, setEstimateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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
  
  const mapDtoToModalProps = (dto: QuoteRequestResDTO): MappedQuoteRequest => ({
    quoteRequestId: dto.requestId,
    customerName: dto.customerName,
    customerPhone: dto.customerPhone,
    status: dto.status,
    carModel: dto.userCar.carModel,
    carYear: dto.userCar.modelYear,
    issueDescription: dto.requestDetails,
    location: dto.address,
    createdDate: new Date(dto.createdAt).toLocaleDateString(),
    images: dto.imageUrls,
  });

  const selectedRequestObject = selectedRequestId
    ? quoteRequests.find(req => req.requestId === selectedRequestId)
    : null;

  const selectedRequestProps = selectedRequestObject
    ? mapDtoToModalProps(selectedRequestObject)
    : null;
    
  const handleOpenModal = (requestId: number, type: 'detail' | 'estimate') => {
    setSelectedRequestId(requestId);
    if (type === 'detail') {
      setDetailModalOpen(true);
    } else {
      setDetailModalOpen(false);
      setEstimateModalOpen(true);
    }
  };

  const handleEstimateSubmit = async (estimateDataFromModal: any) => {
    if (!selectedRequestProps) return;
    try {
      const apiPayload: EstimateReqDTO = {
        requestId: selectedRequestProps.quoteRequestId,
        estimatedCost: estimateDataFromModal.totalPrice,
        details: estimateDataFromModal.description,
        estimateItems: estimateDataFromModal.items.map((item: any): EstimateItemReqDTO => ({
          itemName: item.itemName,
          price: item.partPrice + item.laborCost,
          requiredHours: 0,
          partType: "부품",
        })),
        workDuration: estimateDataFromModal.workDuration || "1~2일",
        validUntil: estimateDataFromModal.validUntil || "",
      };
      await carCenterApi.submitEstimate(apiPayload);
      toast({ title: '견적서가 성공적으로 전송되었습니다.' });
      setEstimateModalOpen(false);
      setSelectedRequestId(null);
      loadQuoteRequests();
    } catch(error) {
      toast({ title: '견적서 전송에 실패했습니다.', variant: 'destructive'});
    }
  };
  
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
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(request.requestId, 'detail')}><Eye className="h-4 w-4 mr-1" />상세보기</Button>
                        <Button size="sm" onClick={() => handleOpenModal(request.requestId, 'estimate')}><Edit className="h-4 w-4 mr-1" />견적 작성</Button>
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
      <QuoteRequestDetailModal 
        open={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        quoteRequest={selectedRequestProps}
        onCreateEstimate={() => {
          if (selectedRequestProps) {
            setDetailModalOpen(false);
            setEstimateModalOpen(true);
          }
        }} 
      />
      <EstimateCreateModal 
        open={estimateModalOpen} 
        onClose={() => setEstimateModalOpen(false)} 
        quoteRequest={selectedRequestProps} 
        onSubmit={handleEstimateSubmit} 
      />
    </>
  );
};