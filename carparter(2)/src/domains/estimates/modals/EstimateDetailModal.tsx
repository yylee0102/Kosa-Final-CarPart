// 파일 경로: src/domains/estimates/modals/EstimateDetailModal.tsx (최종 업그레이드 버전)

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { User, Car, Calendar, MessageSquare, CheckCircle, Loader2, Clock, ShieldCheck } from 'lucide-react';
// 1. user.api.ts에서 "공식" 타입을 직접 import 합니다.
import UserApiService, { Estimate, EstimateItem } from '@/services/user.api';
import { toast } from 'sonner';

// 2. 모달 내부에 있던 자체 타입 정의를 모두 삭제합니다.

// 모달이 받을 props 타입을 정의합니다.
interface EstimateDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimate: Estimate | null;
  onConfirm: () => void;
  onChat: (centerId: string, centerName: string, estimateId:number) => void;
}

export const EstimateDetailModal = ({
  open,
  onClose,
  estimate,
  onConfirm,
  onChat
}: EstimateDetailModalProps) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(estimate?.status === 'ACCEPTED');

  const handleConfirmClick = async () => {
    if (!estimate) return;
    if (!window.confirm("정말 이 견적으로 확정하시겠습니까? 확정 후에는 되돌릴 수 없습니다.")) {
        return;
    }

    setIsSubmitting(true);
    try {
        // 3. user.api.ts의 acceptEstimate 함수를 호출하도록 수정합니다.
        await UserApiService.acceptEstimate(estimate.estimateId);
        
        toast.success("견적이 확정되었습니다. 카센터에서 수리를 진행할 예정입니다.");
        setIsConfirmed(true);
        onConfirm(); // 부모 컴포넌트의 목록 새로고침 함수 호출
        
    } catch (error) {
        toast.error("견적 확정 중 오류가 발생했습니다.");
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const totals = useMemo(() => {
    if (!estimate?.estimateItems) return { totalPrice: 0, totalHours: 0 };
    const totalHours = estimate.estimateItems.reduce((sum, item) => sum + item.requiredHours, 0);
    return { totalPrice: estimate.estimatedCost, totalHours };
  }, [estimate]);

  if (!estimate) return null;

  const getStatusText = (status: string) => {
    if (isConfirmed) return "수리 진행중";
    switch (status) {
      case 'PENDING': return '대기중';
      case 'ACCEPTED': return '수락됨'; // 이 상태는 isConfirmed로 처리됨
      case 'REJECTED': return '거절됨';
      default: return '알 수 없음';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (isConfirmed) return "default"; // '수리 진행중'은 파란색
    switch (status) {
      case 'PENDING': return 'secondary'; // '대기중'은 회색
      case 'REJECTED': return 'destructive'; // '거절됨'은 빨간색
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader className="pr-10">
          <DialogTitle className="text-2xl font-bold text-primary">{estimate.centerName}</DialogTitle>
          <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4" />
              <span>견적 도착일: {new Date(estimate.createdAt).toLocaleDateString()}</span>
            </div>
            <Badge variant={getStatusBadgeVariant(estimate.status)}>
              {getStatusText(estimate.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">차량 및 고객 정보</h3>
            <Card className="bg-muted/50">
              <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">차량 모델</p>
                    <p className="font-medium">{estimate.carModel} ({estimate.carYear}년)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">고객명</p>
                    <p className="font-medium">{estimate.customerName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3">견적 상세</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>수리 항목</TableHead>
                    <TableHead className="text-center">구분</TableHead>
                    <TableHead className="text-right">예상 금액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimate.estimateItems.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{item.partType}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{item.price.toLocaleString()} 원</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={2}>총 예상 금액</TableCell>
                    <TableCell className="text-right text-primary text-lg">{totals.totalPrice.toLocaleString()} 원</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">카센터 설명</h3>
            <Card className="bg-muted/50">
              <CardContent className="p-4 flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-sm text-muted-foreground italic">
                  "{estimate.details}"
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

      <DialogFooter className="pt-6 sm:justify-end gap-2">
          
          {!isConfirmed && estimate.status === 'PENDING' && (
            <>
              <Button variant="outline" onClick={() => onChat(estimate.centerId, estimate.centerName,  estimate.estimateId)} disabled={isSubmitting}>
                <MessageSquare className="h-4 w-4 mr-2" />
                채팅 문의
              </Button>
              <Button onClick={handleConfirmClick} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {isSubmitting ? '처리 중...' : '이 견적으로 확정'}
              </Button>
            </>
          )}
          <Button variant="ghost" onClick={onClose}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};