// 파일 경로: src/domains/estimates/modals/EstimateDetailModal.tsx

import { useState, useMemo } from 'react';
// useState 임포트
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { User, Car, Calendar, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'; // Loader2 아이콘 추가
import UserApiService from '@/services/user.api'; // API 서비스 임포트
import { toast } from 'sonner';

// 백엔드 DTO에 맞춰 TypeScript 인터페이스를 정의합니다.
interface EstimateItem {
  itemId: number;
  itemName: string;
  price: number;
  requiredHours: number;
  partType: string;
}
  
interface Estimate {
  estimateId: number;
  estimatedCost: number;
  centerName: string; 
  centerId: string;
  details: string;
  createdAt: string;
  status: string;
  customerName: string;
  carModel: string;
  carYear: number;
  estimateItems: EstimateItem[];
}

// 모달이 받을 props 타입을 정의합니다.
interface EstimateDetailModalProps {
  open: boolean;
  onClose: () => void;
  estimate: Estimate | null;
  centerName: string; // 카센터 이름은 부모 컴포넌트에서 전달
  onConfirm: () => void;
  onChat: (centerId: string, centerName: string) => void; // ✅ 파라미터를 받도록 수정
}

export const EstimateDetailModal = ({ 
  open, 
  onClose, 
  estimate,
  centerName,
  onConfirm, // 부모 컴포넌트의 데이터 리프레시 함수
  onChat
}: EstimateDetailModalProps) => {

    // ✅ [추가] 로딩 상태와 확정 상태를 관리하는 State
  const [isSubmitting, setIsSubmitting] = useState(false);
  // estimate.status가 'ACCEPTED'이면 이미 확정된 것으로 간주
  const [isConfirmed, setIsConfirmed] = useState(estimate?.status === 'ACCEPTED');

    const handleConfirmClick = async () => {
      if (!estimate) return;
      if (!window.confirm("정말 이 견적으로 확정하시겠습니까? 확정 후에는 다른 견적서와 채팅 내역이 모두 삭제되며 되돌릴 수 없습니다.")) {
          return;
      }

      setIsSubmitting(true);
      try {
          // ✅ [수정] user.api.ts에 추가한 confirmEstimate 함수 호출
          await UserApiService.confirmEstimate(estimate.estimateId);
          
          toast.success("견적이 확정되었습니다. 카센터에서 수리를 진행할 예정입니다.");
          setIsConfirmed(true); // UI를 '확정됨' 상태로 변경
          onConfirm(); // 부모 컴포넌트에 확정 사실을 알려 데이터 목록 새로고침
          
      } catch (error) {
          toast.error("견적 확정 중 오류가 발생했습니다.");
          console.error(error);
      } finally {
          setIsSubmitting(false);
      }
    };



  
  // 총 소요 시간과 금액을 useMemo로 계산하여 성능 최적화
  const totals = useMemo(() => {
    if (!estimate?.estimateItems) return { totalPrice: 0, totalHours: 0 };
    
    const totalHours = estimate.estimateItems.reduce((sum, item) => sum + item.requiredHours, 0);
    // estimatedCost는 이미 총액이므로 그대로 사용
    return { totalPrice: estimate.estimatedCost, totalHours };
  }, [estimate]);

  if (!estimate) return null;

    // ✅ [수정] 확정 상태에 따라 상태 텍스트와 뱃지 색상을 동적으로 변경
  const statusText = isConfirmed ? "진행중" : estimate.status;
  const statusBadgeVariant = isConfirmed ? "default" : "secondary";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader className="pr-10">
          <DialogTitle className="text-2xl font-bold text-primary">{centerName}</DialogTitle>
          {/* DialogDescription을 div로 교체하고, 스타일을 직접 적용합니다. */}
          <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4" />
              <span>견적 도착일: {new Date(estimate.createdAt).toLocaleDateString()}</span>
            </div>
            <Badge variant={estimate.status === 'CONFIRMED' ? 'default' : 'secondary'}>
              {estimate.status}
            </Badge>
            </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
          {/* 차량 및 고객 정보 */}
          <section>
            <h3 className="text-lg font-semibold mb-3">차량 정보</h3>
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
          
          {/* 견적 상세 내역 테이블 */}
          <section>
            <h3 className="text-lg font-semibold mb-3">견적 상세</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>수리 항목</TableHead>
                    <TableHead className="text-center">부품</TableHead>
                    <TableHead className="text-right">소요 시간</TableHead>
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
                      <TableCell className="text-right">{item.requiredHours} 시간</TableCell>
                      <TableCell className="text-right">{item.price.toLocaleString()} 원</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={2}>합계</TableCell>
                    <TableCell className="text-right text-primary">{totals.totalHours} 시간</TableCell>
                    <TableCell className="text-right text-primary text-lg">{totals.totalPrice.toLocaleString()} 원</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </section>

          {/* 카센터 설명 */}
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

      <DialogFooter className="pt-6">
          <Button variant="ghost" onClick={onClose}>닫기</Button>
        {/* ✅ [수정] isConfirmed 상태가 아닐 때만 '채팅'과 '확정' 버튼을 보여줌 */}
          {!isConfirmed && (
            <>
              <Button variant="outline" onClick={() => onChat(estimate.centerId, centerName)} disabled={isSubmitting}>
                <MessageSquare className="h-4 w-4 mr-2" />
                채팅 문의
              </Button>
              <Button onClick={handleConfirmClick} disabled={isSubmitting}>
              <>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? '처리 중...' : '이 견적으로 확정'}
      
                </>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};