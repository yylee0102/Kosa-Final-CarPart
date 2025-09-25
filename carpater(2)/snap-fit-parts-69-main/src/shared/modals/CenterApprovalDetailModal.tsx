/**
 * 카센터 승인 상세 모달 (수정 완료)
 * - admin.api.ts 서비스와 완벽하게 연동
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building, Phone, MapPin, FileText, Calendar, Check, X, Loader2 } from 'lucide-react';
import adminApiService, { CarCenterApprovalResDTO } from '@/services/admin.api';

interface CarCenterApprovalDetail extends CarCenterApprovalResDTO {
  ownerName?: string;
  description?: string;
}

interface CenterApprovalDetailModalProps {
  open: boolean;
  onClose: () => void;
  approvalId: number | null;
  onApprovalUpdate: () => void;
}

export const CenterApprovalDetailModal = ({ open, onClose, approvalId, onApprovalUpdate }: CenterApprovalDetailModalProps) => {
  const { toast } = useToast();
  const [approval, setApproval] = useState<CarCenterApprovalDetail | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (approvalId && open) {
      loadApprovalDetail(approvalId);
    }
    if (!open) {
      resetModalState();
    }
  }, [approvalId, open]);

  const resetModalState = () => {
    setApproval(null);
    setShowRejectForm(false);
    setRejectionReason('');
  };

  const loadApprovalDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getApprovalDetail(id);
      setApproval(data);
    } catch (error) {
      toast({
        title: '오류',
        description: '상세 정보를 불러오는 데 실패했습니다.',
        variant: 'destructive',
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approval) return;
    setIsSubmitting(true);
    try {
      await adminApiService.approveCenter(approval.approvalId);
      toast({ title: '카센터가 승인되었습니다.' });
      onApprovalUpdate();
      onClose();
    } catch (error) {
      toast({
        title: '승인 실패',
        description: error instanceof Error ? error.message : "승인 처리에 실패했습니다.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!approval || !rejectionReason.trim()) {
      toast({
        title: '반려 사유 필요',
        description: '반려 사유를 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await adminApiService.rejectCenter(approval.approvalId, rejectionReason);
      toast({ title: '카센터 신청이 반려되었습니다.' });
      onApprovalUpdate();
      onClose();
    } catch (error) {
       toast({
        title: '반려 실패',
        description: error instanceof Error ? error.message : "반려 처리에 실패했습니다.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'PENDING': return '승인 대기';
      case 'APPROVED': return '승인 완료';
      case 'REJECTED': return '반려';
      default: return status || '알 수 없음';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>카센터 승인 관리</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">정보를 불러오는 중...</span>
          </div>
        ) : approval ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">신청 #{approval.approvalId}</span>
                <Badge className={getStatusColor(approval.status)}>
                  {getStatusText(approval.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>{approval.centerName}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{approval.phoneNumber ?? '-'}</span></div>
                <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{approval.businessNumber ?? '-'}</span></div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{new Date(approval.requestedAt).toLocaleString('ko-KR')}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div><Label className="text-base font-medium">카센터 아이디</Label><p className="mt-1 p-3 bg-gray-50 rounded border">{approval.centerId}</p></div>
              {approval.ownerName && <div><Label className="text-base font-medium">사업자명</Label><p className="mt-1 p-3 bg-gray-50 rounded border">{approval.ownerName}</p></div>}
              <div><Label className="text-base font-medium">주소</Label><p className="mt-1 p-3 bg-gray-50 rounded border flex items-center gap-2"><MapPin className="h-4 w-4" />{approval.address ?? '-'}</p></div>
              {approval.description && (
                <div><Label className="text-base font-medium">카센터 소개</Label><p className="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">{approval.description}</p></div>
              )}
            </div>

            {showRejectForm && (
              <div>
                <Label htmlFor="rejectionReason" className="text-base font-medium text-red-600">반려 사유 *</Label>
                <Textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="반려 사유를 구체적으로 작성해주세요" rows={4} />
              </div>
            )}

            <div className="flex justify-end gap-2">
              {approval.status === 'PENDING' && !showRejectForm && (
                <>
                  <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                    승인
                  </Button>
                  <Button variant="destructive" onClick={() => setShowRejectForm(true)} disabled={isSubmitting}>
                    <X className="h-4 w-4 mr-2" />
                    반려
                  </Button>
                </>
              )}
              
              {showRejectForm && (
                <>
                  <Button onClick={handleReject} variant="destructive" disabled={isSubmitting}>
                     {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                    반려 처리
                  </Button>
                  <Button variant="outline" onClick={() => { setShowRejectForm(false); setRejectionReason(''); }} disabled={isSubmitting}>
                    취소
                  </Button>
                </>
              )}
              
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                닫기
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default CenterApprovalDetailModal;