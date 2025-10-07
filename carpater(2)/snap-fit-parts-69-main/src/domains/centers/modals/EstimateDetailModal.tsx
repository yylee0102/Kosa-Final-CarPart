/**
 * 견적서 상세보기 모달 (UI 일관성 강화 최종본)
 * - carCenter.api.ts의 EstimateResDTO 타입과 완벽히 일치
 */
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Wrench, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EstimateResDTO } from '@/services/carCenter.api';

interface EstimateDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimate: EstimateResDTO | null;
}

export const EstimateDetailModal = ({ open, onClose, estimate }: EstimateDetailModalProps) => {
  if (!estimate) return null;

  const getStatusInfo = (status: EstimateResDTO['status']) => {
    switch (status) {
      case 'ACCEPTED': return { Icon: CheckCircle, text: '수락됨', color: 'bg-green-100 text-green-800' };
      case 'REJECTED': return { Icon: XCircle, text: '거절됨', color: 'bg-red-100 text-red-800' };
      default: return { Icon: Clock, text: '검토중', color: 'bg-yellow-100 text-yellow-800' };
    }
  };
  const statusInfo = getStatusInfo(estimate.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />견적서 상세정보 #{estimate.estimateId}</DialogTitle></DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <Badge className={statusInfo.color}><div className="flex items-center gap-1"><statusInfo.Icon className="h-4 w-4" />{statusInfo.text}</div></Badge>
            <div className="text-sm text-muted-foreground">견적 요청 ID: #{estimate.requestId}</div>
          </div>
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><User className="h-5 w-5" />고객 및 차량 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted p-4 rounded-lg">
              <div><strong className="w-16 inline-block">고객명:</strong> {estimate.customerName}</div>
              <div><strong className="w-16 inline-block">차량:</strong> {estimate.carModel} ({estimate.carYear}년)</div>
            </div>
          </div>
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Wrench className="h-5 w-5" />견적 내용</h3>
            <div className="space-y-4">
              {estimate.estimateItems && estimate.estimateItems.length > 0 && (
                <div>
                  <label className="text-sm font-medium">세부 항목</label>
                  <div className="mt-1 border rounded-lg">
                    <Table>
                      <TableHeader><TableRow><TableHead>항목명</TableHead><TableHead>구분</TableHead><TableHead>수량</TableHead><TableHead className="text-right">예상 시간</TableHead><TableHead className="text-right">금액</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {estimate.estimateItems.map(item => (
                          <TableRow key={item.itemId}>
                            <TableCell className="font-medium">{item.itemName}</TableCell>
                            <TableCell>{item.partType}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.requiredHours} 시간</TableCell>
                            <TableCell className="text-right">{item.price.toLocaleString()}원</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">카센터 상세 설명</label>
                <p className="text-base mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">{estimate.details || '상세 설명이 없습니다.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                <div><strong className="text-muted-foreground">예상 작업 시간:</strong> {estimate.workDuration || '정보 없음'}</div>
                <div><strong className="text-muted-foreground">견적 유효기간:</strong> {estimate.validUntil ? new Date(estimate.validUntil).toLocaleDateString() : '정보 없음'}</div>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg mt-4">
                <span className="font-semibold text-blue-800">총 견적 금액</span>
                <span className="text-2xl font-bold text-blue-800">{estimate.estimatedCost.toLocaleString()}원</span>
              </div>
              <div className="text-sm text-muted-foreground pt-2"><div className="flex items-center gap-1"><Calendar className="h-4 w-4" />견적서 작성일: {new Date(estimate.createdAt).toLocaleDateString()}</div></div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t"><Button variant="outline" onClick={onClose}>닫기</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};