// src/domains/centers/modals/RepairDetailModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CompletedRepairResDTO } from '@/services/completedRepair.api';
import { Badge } from '@/components/ui/badge';
import { User, Car, Wrench, DollarSign, Calendar } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  repair: CompletedRepairResDTO | null;
  onMarkAsComplete: (repairId: number) => void; // 완료 처리 함수 props로 받기
}

export const RepairDetailModal = ({ open, onClose, repair, onMarkAsComplete }: Props) => {
  if (!repair) return null;

  const getStatusInfo = (status: string) => {
    return status === 'COMPLETED'
      ? { text: '완료됨', color: 'bg-green-100 text-green-800' }
      : { text: '진행중', color: 'bg-blue-100 text-blue-800' };
  };

  const statusInfo = getStatusInfo(repair.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>수리 내역 상세 정보 (#{repair.id})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">작업 상태</h3>
            <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
          </div>

          {/* 고객 및 차량 정보 */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
             <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><strong>고객명:</strong><span>{repair.userName}</span></div>
             <div className="flex items-center gap-3"><Car className="h-4 w-4 text-muted-foreground" /><strong>차량:</strong><span>{repair.carModel}({repair.licensePlate})</span></div>
          </div>
          
          {/* 수리 정보 */}
          <div className="space-y-3">
             <div className="flex items-start gap-3"><Wrench className="h-4 w-4 mt-1 text-muted-foreground" /><strong>수리 내용:</strong><p className="text-sm flex-1">{repair.repairDetails}</p></div>
             <div className="flex items-center gap-3"><DollarSign className="h-4 w-4 text-muted-foreground" /><strong>최종 비용:</strong><span className="font-bold text-primary">{repair.finalCost.toLocaleString()}원</span></div>
             <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><strong>접수일:</strong><span>{new Date(repair.createdAt).toLocaleDateString()}</span></div>
             {repair.completedAt && (
                <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><strong>완료일:</strong><span>{new Date(repair.completedAt).toLocaleDateString()}</span></div>
             )}
          </div>
          
          {/* 버튼 영역 */}
          <div className="flex gap-2 pt-4 border-t">
            {repair.status === 'IN_PROGRESS' && (
              <Button onClick={() => onMarkAsComplete(repair.id)} className="flex-1">
                수리 완료 처리
              </Button>
            )}
             <Button variant="outline" onClick={onClose} className="flex-1">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};