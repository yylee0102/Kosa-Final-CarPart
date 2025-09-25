/**
 * 견적서 상세보기 모달
 * 카센터가 제출한 견적서의 상세 정보를 표시
 */
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  DollarSign, 
  User, 
  Car, 
  FileText, 
  Phone, 
  Clock,
  CheckCircle,
  XCircle,
  MapPin
} from 'lucide-react';

interface SentEstimate {
  estimateId: number;
  quoteRequestId: number;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: number;
  partName: string;
  estimatedPrice: number;
  description: string;
  estimatedDate: string;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  validUntil: string;
  issueDescription: string;
}

interface EstimateDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimate: SentEstimate | null;
}

export const EstimateDetailModal = ({ open, onClose, estimate }: EstimateDetailModalProps) => {
  if (!estimate) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '검토중';
      case 'SENT': return '전송됨';
      case 'ACCEPTED': return '수락됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'SENT': return <FileText className="h-4 w-4" />;
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            견적서 상세정보 #{estimate.estimateId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 상태 정보 */}
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(estimate.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(estimate.status)}
                {getStatusText(estimate.status)}
              </div>
            </Badge>
            <div className="text-sm text-muted-foreground">
              견적서 ID: #{estimate.estimateId}
            </div>
          </div>

          <Separator />

          {/* 고객 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              고객 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">고객명</label>
                <p className="text-base">{estimate.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">연락처</label>
                <p className="text-base flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {estimate.customerPhone}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 차량 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Car className="h-5 w-5" />
              차량 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">차량 모델</label>
                <p className="text-base">{estimate.carModel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">연식</label>
                <p className="text-base">{estimate.carYear}년</p>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-muted-foreground">문제 설명</label>
              <p className="text-base mt-1 p-3 bg-muted rounded-lg">
                {estimate.issueDescription}
              </p>
            </div>
          </div>

          <Separator />

          {/* 견적 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              견적 정보
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">부품/서비스</label>
                <p className="text-base font-medium">{estimate.partName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">견적 금액</label>
                <p className="text-2xl font-bold text-primary">
                  {estimate.estimatedPrice.toLocaleString()}원
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">작업 설명</label>
                <p className="text-base mt-1 p-3 bg-muted rounded-lg">
                  {estimate.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">예상 작업일</label>
                  <p className="text-base flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {estimate.estimatedDate}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">견적 유효기간</label>
                  <p className="text-base flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {estimate.validUntil}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 견적서 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">견적서 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-sm font-medium text-muted-foreground">작성일</label>
                <p className="text-base">{new Date(estimate.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">견적 요청 ID</label>
                <p className="text-base">#{estimate.quoteRequestId}</p>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            {estimate.status === 'ACCEPTED' && (
              <Button>
                작업 진행
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};