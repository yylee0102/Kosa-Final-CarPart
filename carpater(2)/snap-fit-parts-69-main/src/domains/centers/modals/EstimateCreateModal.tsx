/**
 * 견적서 작성 모달 - UI 개선 버전
 * - 테이블 칸 너비 최적화
 * - 입력 필드 크기 조정
 * - 반응형 레이아웃
 * - 가독성 향상
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Car, MapPin, Plus, Trash2, Calculator, FileText, Calendar, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EstimateReqDTO, EstimateItemReqDTO } from '@/services/carCenter.api';

interface QuoteRequest {
  quoteRequestId: number;
  customerName: string;
  carModel: string;
  carYear: number;
  issueDescription: string;
  location: string;
  createdDate: string; // <-- 이 줄을 추가

}

interface EstimateCreateModalProps {
  open: boolean;
  onClose: () => void;
  quoteRequest?: QuoteRequest;
  onSubmit: (estimateData: EstimateReqDTO) => void;
}

export const EstimateCreateModal = ({ open, onClose, quoteRequest, onSubmit }: EstimateCreateModalProps) => {
  const { toast } = useToast();
  const [estimateItems, setEstimateItems] = useState<EstimateItemReqDTO[]>([
    { itemName: '', price: 0, requiredHours: 0, partType: '부품', quantity: 1 }
  ]);
  const [workDuration, setWorkDuration] = useState('');
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (open) {
      setEstimateItems([{ itemName: '', price: 0, requiredHours: 0, partType: '부품', quantity: 1 }]);
      setWorkDuration('');
      setDescription('');
      
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 7);
      setValidUntil(validDate.toISOString().split('T')[0]);
    }
  }, [open]);

  useEffect(() => {
    const calculatedTotal = estimateItems.reduce((total, item) =>
      total + (item.price || 0) * (item.quantity || 1), 0
    );
    setTotalCost(calculatedTotal);
  }, [estimateItems]);

  const addEstimateItem = () => {
    setEstimateItems(prev => [...prev, { itemName: '', price: 0, requiredHours: 0, partType: '부품', quantity: 1 }]);
  };

  const removeEstimateItem = (index: number) => {
    if (estimateItems.length > 1) {
      setEstimateItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateEstimateItem = (index: number, field: keyof EstimateItemReqDTO, value: string | number) => {
    setEstimateItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = () => {
    if (!quoteRequest) return;

    const estimateData: EstimateReqDTO = {
      requestId: quoteRequest.quoteRequestId,
      estimatedCost: totalCost,
      details: description,
      estimateItems: estimateItems.filter(item => item.itemName.trim()),
      workDuration,
      validUntil
    };

    onSubmit(estimateData);
    toast({ 
      title: '견적서 전송 완료',
      description: '견적서가 성공적으로 전송되었습니다.'
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6 text-primary" />
            견적서 작성
          </DialogTitle>
        </DialogHeader>

        {quoteRequest && (
          <div className="space-y-6 pt-2">
            {/* 견적 요청 정보 */}
            <div className="bg-muted/50 p-5 rounded-lg border border-border">
              <h3 className="font-semibold mb-4 text-base flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                견적 요청 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">차량 정보</div>
                  <div className="font-medium">{quoteRequest.carModel} ({quoteRequest.carYear}년)</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    위치
                  </div>
                  <div className="font-medium">{quoteRequest.location}</div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <div className="text-muted-foreground">증상 설명</div>
                  <div className="text-sm bg-background p-3 rounded border border-border">
                    {quoteRequest.issueDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* 견적 항목 테이블 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">견적 항목</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addEstimateItem} 
                  type="button"
                  className="h-9"
                >
                  <Plus className="h-4 w-4 mr-1" /> 항목 추가
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[35%] min-w-[200px]">항목명</TableHead>
                      <TableHead className="w-[12%] min-w-[100px]">구분</TableHead>
                      <TableHead className="w-[10%] min-w-[80px] text-center">수량</TableHead>
                      <TableHead className="w-[13%] min-w-[100px] text-center">예상시간</TableHead>
                      <TableHead className="w-[18%] min-w-[130px] text-right">단가</TableHead>
                      <TableHead className="w-[18%] min-w-[130px] text-right">금액</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimateItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="p-2">
                          <Input 
                            placeholder="예: 엔진오일 교환" 
                            value={item.itemName} 
                            onChange={e => updateEstimateItem(index, 'itemName', e.target.value)}
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input 
                            placeholder="부품/공임" 
                            value={item.partType} 
                            onChange={e => updateEstimateItem(index, 'partType', e.target.value)}
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input 
                            type="number" 
                            min="1" 
                            value={item.quantity} 
                            onChange={e => updateEstimateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="text-center h-9"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1">
                            <Input 
                              type="number" 
                              min="0"
                              step="0.5"
                              value={item.requiredHours} 
                              onChange={e => updateEstimateItem(index, 'requiredHours', parseFloat(e.target.value) || 0)}
                              className="text-center h-9"
                            />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">시간</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="0" 
                            value={item.price || ''} 
                            onChange={e => updateEstimateItem(index, 'price', parseInt(e.target.value) || 0)}
                            className="text-right h-9"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right font-medium">
                          {((item.price || 0) * (item.quantity || 1)).toLocaleString()}원
                        </TableCell>
                        <TableCell className="p-2">
                          <Button 
                            type="button" 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeEstimateItem(index)} 
                            disabled={estimateItems.length === 1}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 총 견적 금액 */}
            <div className="bg-primary/10 border-2 border-primary/20 p-5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">총 견적 금액</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {totalCost.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 작업 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workDuration" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  예상 작업 시간
                </Label>
                <Input 
                  id="workDuration" 
                  placeholder="예: 2-3시간" 
                  value={workDuration} 
                  onChange={(e) => setWorkDuration(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  견적 유효기간
                </Label>
                <Input 
                  id="validUntil" 
                  type="date" 
                  value={validUntil} 
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea 
                id="description" 
                placeholder="견적에 대한 상세 설명이나 주의사항을 입력하세요." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={4}
                className="resize-none"
              />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} type="button" className="min-w-[100px]">
                취소
              </Button>
              <Button onClick={handleSubmit} type="button" className="min-w-[100px]">
                견적서 전송
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
