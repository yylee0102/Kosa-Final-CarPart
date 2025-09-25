/**
 * 견적서 작성 모달
 * - 견적 요청에 대한 견적서 작성
 * - 부품별 가격 및 공임비 산정
 * - 예상 작업 시간 및 설명 추가
 * EstimateController의 견적서 제출 API 기반
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, Plus, Trash2, Calculator } from 'lucide-react';

interface QuoteRequest {
  quoteRequestId: number;
  customerName: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  preferredDate: string;
  location: string;
}

interface EstimateItem {
  itemName: string;
  partPrice: number;
  laborCost: number;
  quantity: number;
}

interface EstimateCreateModalProps {
  open: boolean;
  onClose: () => void;
  quoteRequest?: QuoteRequest;
  onSubmit: (estimateData: any) => void;
}

export const EstimateCreateModal = ({ open, onClose, quoteRequest, onSubmit }: EstimateCreateModalProps) => {
  const { toast } = useToast();
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([
    { itemName: '', partPrice: 0, laborCost: 0, quantity: 1 }
  ]);
  const [workDuration, setWorkDuration] = useState('');
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    if (open) {
      // 견적 유효기간 기본값 (7일 후)
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 7);
      setValidUntil(validDate.toISOString().split('T')[0]);
    }
  }, [open]);

  const addEstimateItem = () => {
    setEstimateItems(prev => [...prev, { itemName: '', partPrice: 0, laborCost: 0, quantity: 1 }]);
  };

  const removeEstimateItem = (index: number) => {
    if (estimateItems.length > 1) {
      setEstimateItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateEstimateItem = (index: number, field: keyof EstimateItem, value: string | number) => {
    setEstimateItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return estimateItems.reduce((total, item) => 
      total + (item.partPrice + item.laborCost) * item.quantity, 0
    );
  };

  const handleSubmit = () => {
    if (!quoteRequest) return;

    const estimateData = {
      quoteRequestId: quoteRequest.quoteRequestId,
      items: estimateItems.filter(item => item.itemName.trim()),
      totalPrice: calculateTotal(),
      workDuration,
      description,
      validUntil
    };

    // API 호출: POST /api/estimates/
    onSubmit(estimateData);
    toast({ title: '견적서가 성공적으로 전송되었습니다.' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>견적서 작성</DialogTitle>
        </DialogHeader>
        
        {quoteRequest && (
          <div className="space-y-6">
            {/* 견적 요청 정보 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">견적 요청 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span>{quoteRequest.carModel} ({quoteRequest.carYear}년)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>희망일: {quoteRequest.preferredDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{quoteRequest.location}</span>
                </div>
              </div>
              <div className="mt-3">
                <Label className="text-sm font-medium">증상 설명</Label>
                <p className="text-sm text-gray-600 mt-1">{quoteRequest.issueDescription}</p>
              </div>
            </div>

            {/* 견적 항목 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-medium">견적 항목</Label>
                <Button variant="outline" size="sm" onClick={addEstimateItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  항목 추가
                </Button>
              </div>
              
              <div className="space-y-3">
                {estimateItems.map((item, index) => (
                  <div key={index} className="border p-3 rounded-lg">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-4">
                        <Label className="text-sm">항목명</Label>
                        <Input
                          placeholder="예: 브레이크 패드 교체"
                          value={item.itemName}
                          onChange={(e) => updateEstimateItem(index, 'itemName', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">부품비</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.partPrice}
                          onChange={(e) => updateEstimateItem(index, 'partPrice', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">공임비</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.laborCost}
                          onChange={(e) => updateEstimateItem(index, 'laborCost', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm">수량</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateEstimateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-sm">소계</Label>
                        <div className="text-sm font-medium pt-2">
                          {((item.partPrice + item.laborCost) * item.quantity).toLocaleString()}원
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEstimateItem(index)}
                          disabled={estimateItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 총 금액 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">총 견적 금액</span>
                </div>
                <span className="text-xl font-bold text-blue-800">
                  {calculateTotal().toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workDuration">예상 작업 시간</Label>
                <Input
                  id="workDuration"
                  placeholder="예: 2-3시간"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">견적 유효기간</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                placeholder="견적에 대한 상세 설명이나 주의사항을 입력하세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                견적서 전송
              </Button>
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};