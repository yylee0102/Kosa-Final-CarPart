/**
 * 신규 예약 등록 모달 (카센터 전용)
 */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Phone, Car, FileText, Save, X } from 'lucide-react';
import { ReservationReqDTO } from '@/services/carCenter.api'; // API 파일에서 타입 가져오기

interface ReservationCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newReservationData: ReservationReqDTO) => void;
}

export const ReservationCreateModal = ({ open, onClose, onSubmit }: ReservationCreateModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 폼 데이터를 위한 상태
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [carInfo, setCarInfo] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [datePart, setDatePart] = useState('');
  const [timePart, setTimePart] = useState('');

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCarInfo('');
    setRequestDetails('');
    setDatePart('');
    setTimePart('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!customerName.trim() || !datePart || !timePart) {
      toast({
        title: "입력 오류",
        description: "예약자명, 예약 날짜와 시간은 필수 항목입니다.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // 날짜와 시간을 ISO 형식의 문자열로 조합
      const combinedDateTime = `${datePart}T${timePart}:00`;

      const newReservationData: ReservationReqDTO = {
        customerName,
        customerPhone,
        carInfo,
        reservationDate: combinedDateTime,
        requestDetails,
      };

      await onSubmit(newReservationData);
      
      resetForm();
      // onClose(); // onSubmit에서 성공 시 닫도록 CenterMyPage에서 관리
    } catch (error) {
        // CenterMyPage의 핸들러에서 에러 처리를 하므로 여기서는 로깅만 할 수 있습니다.
        console.error("예약 생성 실패:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            신규 예약 등록
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName"><User className="inline h-4 w-4 mr-1" />예약자명 *</Label>
              <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone"><Phone className="inline h-4 w-4 mr-1" />연락처</Label>
              <Input id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="carInfo"><Car className="inline h-4 w-4 mr-1" />차량 정보</Label>
            <Input id="carInfo" value={carInfo} onChange={(e) => setCarInfo(e.target.value)} placeholder="예: 현대 쏘나타 (2020)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reservationDate">예약 날짜 *</Label>
              <Input id="reservationDate" type="date" value={datePart} onChange={(e) => setDatePart(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reservationTime">예약 시간 *</Label>
              <Input id="reservationTime" type="time" value={timePart} onChange={(e) => setTimePart(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestDetails"><FileText className="inline h-4 w-4 mr-1" />요청 사항</Label>
            <Textarea id="requestDetails" value={requestDetails} onChange={(e) => setRequestDetails(e.target.value)} rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? '저장 중...' : '예약 저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};