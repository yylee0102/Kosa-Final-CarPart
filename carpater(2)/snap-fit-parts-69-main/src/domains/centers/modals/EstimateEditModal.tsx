/**
 * 제출한 견적서 수정 모달 (UI 일관성 강화 최종본)
 * - 총액 계산 시 수량(quantity)을 반영하도록 로직 수정
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, X, DollarSign, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import carCenterApi, { EstimateResDTO, EstimateReqDTO, EstimateItemReqDTO } from '@/services/carCenter.api';

interface EstimateEditModalProps {
  open: boolean;
  onClose: () => void;
  estimate: EstimateResDTO | null;
  onUpdate: () => void;
}

export const EstimateEditModal = ({ open, onClose, estimate, onUpdate }: EstimateEditModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [details, setDetails] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [items, setItems] = useState<EstimateItemReqDTO[]>([]);
  const [workDuration, setWorkDuration] = useState('');
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    if (estimate) {
      setDetails(estimate.details);
      setEstimatedCost(estimate.estimatedCost);
      // ✅ estimate.estimateItems는 EstimateItemResDTO[] 타입이므로 EstimateItemReqDTO[]로 맞춰줌
      setItems(estimate.estimateItems.map(item => ({
        itemName: item.itemName,
        price: item.price,
        requiredHours: item.requiredHours,
        partType: item.partType,
        quantity: item.quantity
      })) || []);
      setWorkDuration(estimate.workDuration || '');
      setValidUntil(estimate.validUntil ? estimate.validUntil.split('T')[0] : '');
    }
  }, [estimate]);

  // ✅ 총액 계산 시 수량(quantity)을 반영하도록 수정
  useEffect(() => {
    const total = items.reduce((sum, currentItem) => 
      sum + (currentItem.price || 0) * (currentItem.quantity || 1), 0);
    setEstimatedCost(total);
  }, [items]);

  const addItem = () => setItems([...items, { itemName: '', price: 0, requiredHours: 0, partType: '부품', quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof EstimateItemReqDTO, value: string | number) => {
    const newItems = [...items];
    const itemToUpdate = { ...newItems[index] };
    (itemToUpdate as any)[field] = value;
    newItems[index] = itemToUpdate;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimate) return;

    setIsLoading(true);
    try {
      const updatePayload: EstimateReqDTO = {
        requestId: estimate.requestId,
        estimatedCost,
        details,
        estimateItems: items,
        workDuration,
        validUntil,
      };

      await carCenterApi.updateEstimate(estimate.estimateId, updatePayload);

      toast({ title: '수정 완료', description: '견적서가 성공적으로 수정되었습니다.' });
      onUpdate();
      onClose();
    } catch (error) {
      toast({ title: '수정 실패', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!estimate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>견적서 수정 #{estimate.estimateId}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center"><Label>세부 항목</Label><Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="h-4 w-4 mr-1" />항목 추가</Button></div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader><TableRow><TableHead className="w-2/5">항목명</TableHead><TableHead>구분</TableHead><TableHead>수량</TableHead><TableHead>예상 시간(H)</TableHead><TableHead className="text-right">금액</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground h-24">세부 항목이 없습니다.</TableCell></TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell><Input value={item.itemName} onChange={e => updateItem(index, 'itemName', e.target.value)} /></TableCell>
                        <TableCell><Input value={item.partType} onChange={e => updateItem(index, 'partType', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', Number(e.target.value) || 1)} className="text-center" /></TableCell>
                        <TableCell><Input type="number" min="0" value={item.requiredHours} onChange={e => updateItem(index, 'requiredHours', Number(e.target.value) || 0)} className="text-right" /></TableCell>
                        <TableCell><Input type="number" min="0" value={item.price} onChange={e => updateItem(index, 'price', Number(e.target.value) || 0)} className="text-right" /></TableCell>
                        <TableCell><Button type="button" size="icon" variant="ghost" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="workDuration">예상 작업 시간</Label><Input id="workDuration" value={workDuration} onChange={(e) => setWorkDuration(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="validUntil">견적 유효기간</Label><Input id="validUntil" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="details">카센터 상세 설명</Label><Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} rows={4} /></div>
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg mt-4"><span className="font-semibold text-blue-800 flex items-center gap-2"><DollarSign className="h-5 w-5" />총 견적 금액</span><span className="text-2xl font-bold text-blue-800">{estimatedCost.toLocaleString()}원</span></div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}><X className="h-4 w-4 mr-1" />취소</Button>
            <Button type="submit" disabled={isLoading}><Save className="h-4 w-4 mr-1" />{isLoading ? '저장 중...' : '수정 저장'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};