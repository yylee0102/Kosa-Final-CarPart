/**
 * 견적 요청 상세보기 모달
 * - 고객의 견적 요청 상세 정보 조회
 * - 차량 이미지 및 문제 설명 상세 확인
 * - 견적서 작성 모달로 연결
 */
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Calendar, MapPin, User, Phone, FileText, Edit } from 'lucide-react';

// QuoteRequestDetailModal.tsx

interface QuoteRequest {
  quoteRequestId: number;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  // ✅ 아래 필드들을 EstimateRequestsPage와 동일하게 맞춰줍니다.
  createdDate: string;
  images?: string[];
}

interface QuoteRequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  quoteRequest: QuoteRequest | null;
  onCreateEstimate: (request: QuoteRequest) => void;
}

export const QuoteRequestDetailModal: React.FC<QuoteRequestDetailModalProps> = ({
  open,
  onClose,
  quoteRequest,
  onCreateEstimate
}) => {
  if (!quoteRequest) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>견적 요청 상세 정보</DialogTitle>
          <DialogDescription>
            고객의 견적 요청 상세 내용을 확인하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 상태 및 기본 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(quoteRequest.status)}>
                {getStatusText(quoteRequest.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                요청번호: #{quoteRequest.quoteRequestId}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              요청일: {quoteRequest.createdDate}
            </span>
          </div>

          {/* 고객 정보 */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              고객 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">이름: </span>
                <span className="text-sm">{quoteRequest.customerName}</span>
              </div>
              <div>
                <span className="text-sm font-medium">연락처: </span>
                <span className="text-sm">{quoteRequest.customerPhone}</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">위치: </span>
              <span className="text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {quoteRequest.location}
              </span>
            </div>
          </div>

          {/* 차량 정보 */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Car className="h-4 w-4" />
              차량 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">차량 모델: </span>
                <span className="text-sm">{quoteRequest.carModel}</span>
              </div>
              <div>
                <span className="text-sm font-medium">연식: </span>
                <span className="text-sm">{quoteRequest.carYear}년</span>
              </div>
            </div>
            <div>
              
            </div>
          </div>

          {/* 문제 설명 */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              문제 설명
            </h3>
            <p className="text-sm leading-relaxed">{quoteRequest.issueDescription}</p>
          </div>

          {/* 첨부 이미지 */}
          {quoteRequest.images && quoteRequest.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">첨부 이미지</h3>
              <div className="grid grid-cols-3 gap-3">
                {quoteRequest.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`차량 사진 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(image, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            {quoteRequest.status === 'PENDING' && (
              <Button onClick={() => onCreateEstimate(quoteRequest)}>
                <Edit className="h-4 w-4 mr-2" />
                견적서 작성
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};