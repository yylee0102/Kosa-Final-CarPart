/**
 * 견적서 작성 모달
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, Plus, Trash2, Calculator } from 'lucide-react';
import { QuoteRequest, EstimateItem } from '@/services/carCenter.api';

interface EstimateCreateModalProps {
  open: boolean;
  onClose: () => void;
  quoteRequest: QuoteRequest | null;
  onSubmit: (estimateData: any) => void;
}

const DEFAULT_ESTIMATE_ITEM: EstimateItem = { 
  itemName: '', 
  partPrice: 0, 
  laborCost: 0, 
  quantity: 1 
};

const DEFAULT_VALIDITY_DAYS = 7;

export const EstimateCreateModal = ({ 
  open, 
  onClose, 
  quoteRequest, 
  onSubmit 
}: EstimateCreateModalProps) => {
  const { toast } = useToast();
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([DEFAULT_ESTIMATE_ITEM]);
  const [workDuration, setWorkDuration] = useState('');
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    if (open) {
      setEstimateItems([DEFAULT_ESTIMATE_ITEM]);
      setWorkDuration('');
      setDescription('');
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + DEFAULT_VALIDITY_DAYS);
      setValidUntil(validDate.toISOString().split('T')[0]);
    }
  }, [open]);

  const addEstimateItem = () => {
    setEstimateItems(prev => [...prev, DEFAULT_ESTIMATE_ITEM]);
  };

  const removeEstimateItem = (index: number) => {
    if (estimateItems.length > 1) {
      setEstimateItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateEstimateItem = (index: number, field: keyof EstimateItem, value: string | number) => {
    setEstimateItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const calculateTotal = () => {
    return estimateItems.reduce(
      (total, item) => total + (item.partPrice + item.laborCost) * item.quantity,
      0
    );
  };

  const handleSubmit = () => {
    if (!quoteRequest) return;

    const validItems = estimateItems.filter(item => item.itemName.trim() !== '');
    if (validItems.length === 0) {
      toast({
        title: '항목을 입력해주세요.',
        description: '적어도 하나 이상의 견적 항목을 작성해야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    const estimateData = {
      quoteRequestId: quoteRequest.quoteRequestId,
      items: validItems,
      totalPrice: calculateTotal(),
      workDuration,
      description,
      validUntil,
    };
    
    onSubmit(estimateData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">견적서 작성</DialogTitle>
        </DialogHeader>
        
        {quoteRequest && (
          <div className="space-y-6">
            {/* 견적 요청 정보 */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-3">견적 요청 정보</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{quoteRequest.carModel} ({quoteRequest.carYear}년)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{quoteRequest.location}</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>요청일: {quoteRequest.createdDate}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Label className="text-sm font-medium">증상 설명</Label>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                  {quoteRequest.issueDescription}
                </p>
              </div>
            </div>

            {/* 견적 항목 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-base font-semibold">견적 항목</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addEstimateItem}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  항목 추가
                </Button>
              </div>
              
              <div className="space-y-3">
                {estimateItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="border border-border p-4 rounded-lg bg-card"
                  >
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-12 sm:col-span-3">
                        <Label className="text-xs text-muted-foreground">항목명</Label>
                        <Input
                          placeholder="예: 브레이크 패드 교체"
                          value={item.itemName}
                          onChange={(e) => updateEstimateItem(index, 'itemName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">부품비</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.partPrice || ''}
                          onChange={(e) => updateEstimateItem(index, 'partPrice', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">공임비</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.laborCost || ''}
                          onChange={(e) => updateEstimateItem(index, 'laborCost', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">수량</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateEstimateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">소계</Label>
                        <div className="text-sm font-semibold h-10 flex items-center mt-1">
                          {((item.partPrice + item.laborCost) * item.quantity).toLocaleString()}원
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEstimateItem(index)}
                          disabled={estimateItems.length === 1}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">총 견적 금액</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {calculateTotal().toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workDuration">예상 작업 시간</Label>
                <Input
                  id="workDuration"
                  placeholder="예: 2-3시간"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="validUntil">견적 유효기간</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="mt-1"
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
                rows={4}
                className="mt-1"
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleSubmit}>
                견적서 전송
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
