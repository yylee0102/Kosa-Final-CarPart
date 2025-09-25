/**
 * 제출한 견적서 수정 모달 (API 연동 최종본)
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, X, DollarSign } from 'lucide-react';
import carCenterApi, { EstimateResDTO, EstimateReqDTO } from '@/services/carCenter.api';

interface EstimateEditModalProps {
  open: boolean;
  onClose: () => void;
  estimate: EstimateResDTO | null;
  onUpdate: () => void; // 부모 컴포넌트의 목록을 새로고침하기 위한 함수
}

export const EstimateEditModal = ({ open, onClose, estimate, onUpdate }: EstimateEditModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    estimatedCost: 0,
    details: '',
  });

  useEffect(() => {
    if (estimate) {
      setFormData({
        estimatedCost: estimate.estimatedCost,
        details: estimate.details,
      });
    }
  }, [estimate]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimate) return;

    setIsLoading(true);
    try {
      // ✅ [수정] API가 요구하는 완전한 EstimateReqDTO 형태로 데이터를 만듭니다.
      const updatePayload: EstimateReqDTO = {
        requestId: estimate.requestId, // 기존 정보에서 필수값을 가져옵니다.
        estimatedCost: formData.estimatedCost, // 수정한 값을 사용합니다.
        details: formData.details, // 수정한 값을 사용합니다.
        // 기존 estimateItems가 있다면 그대로 사용하고, 없다면 빈 배열을 보냅니다.
        estimateItems: estimate.estimateItems || [], 
      };

      await carCenterApi.updateEstimate(estimate.estimateId, updatePayload);
      
      toast({ title: '수정 완료', description: '견적서가 성공적으로 수정되었습니다.' });
      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: '수정 실패',
        description: '견적서 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!estimate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>견적서 수정 #{estimate.estimateId}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="bg-muted p-3 rounded-lg text-sm">
            {/* 백엔드 DTO가 수정되면 여기에 실제 고객/차량 정보 표시 */}
            <p><strong>고객:</strong> 요청 #{estimate.requestId}의 고객</p>
          </div>
        
          <div className="space-y-2">
            <Label htmlFor="estimatedCost"><DollarSign className="inline h-4 w-4 mr-1"/>견적 금액</Label>
            <Input
              id="estimatedCost"
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => handleInputChange('estimatedCost', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">상세 설명</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />{isLoading ? '저장 중...' : '수정 저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};