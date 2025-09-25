/**
 * 예약 상세 관리 모달 (백엔드 LocalDateTime 기준)
 * - props로 받은 reservationDate (ISO 문자열)를 날짜와 시간으로 분리/조합하여 처리
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Phone, Car, FileText, Trash2 } from 'lucide-react';

// 백엔드 Reservation.java 엔티티와 일치하는 타입 (CenterMyPage에서 가져오거나 공유)
interface Reservation {
  reservationId: number;
  customerName: string;
  customerPhone: string;
  carInfo: string;
  reservationDate: string; // "2025-09-25T14:00:00"
  requestDetails: string;
}

interface ReservationManageModalProps {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation | null; // null일 수도 있음을 명시
  onUpdate: (updatedReservation: Reservation) => void;
}

export const ReservationManageModal = ({ open, onClose, reservation, onUpdate }: ReservationManageModalProps) => {
  const { toast } = useToast();
  
  // ** 변경점: 폼 데이터와 UI용 날짜/시간 상태 분리 **
  const [formData, setFormData] = useState<Omit<Reservation, 'reservationId' | 'reservationDate'>>({
    customerName: '',
    customerPhone: '',
    carInfo: '',
    requestDetails: ''
  });
  const [datePart, setDatePart] = useState('');
  const [timePart, setTimePart] = useState('');

  // ** 변경점: 모달이 열리거나 reservation 데이터가 바뀔 때 상태 초기화 **
  useEffect(() => {
    if (reservation) {
      const { reservationId, reservationDate, ...rest } = reservation;
      setFormData(rest);
      
      if (reservationDate) {
        // ISO 문자열을 날짜('YYYY-MM-DD')와 시간('HH:mm')으로 분리
        const dateObj = new Date(reservationDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        setDatePart(`${year}-${month}-${day}`);
        setTimePart(dateObj.toTimeString().slice(0, 5));
      } else {
        setDatePart('');
        setTimePart('');
      }
    }
  }, [reservation]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!reservation) return;
    if (!datePart || !timePart) {
      toast({ title: "예약 날짜와 시간을 모두 입력해주세요.", variant: "destructive"});
      return;
    }

    // ** 변경점: 분리된 날짜와 시간을 다시 LocalDateTime 형식의 문자열로 조합 **
    // 백엔드가 ZonedDateTime을 사용하면 new Date().toISOString()이 더 적합할 수 있음
    const combinedDateTime = `${datePart}T${timePart}:00`;

    const updatedReservation: Reservation = {
      ...formData,
      reservationId: reservation.reservationId,
      reservationDate: combinedDateTime
    };

    onUpdate(updatedReservation);
    toast({ title: '예약 정보가 업데이트되었습니다.' });
    onClose();
  };

  const handleCall = () => {
    if (reservation) {
       window.open(`tel:${reservation.customerPhone}`);
    }
  };

  // reservation 데이터가 없으면 모달을 렌더링하지 않음
  if (!reservation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>예약 관리</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 예약 기본 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">예약 #{reservation.reservationId}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{reservation.customerName}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{reservation.customerPhone}</span></div>
              <div className="flex items-center gap-2"><Car className="h-4 w-4" /><span>{formData.carInfo}</span></div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{datePart}</span></div>
            </div>
          </div>

          {/* 예약 시간 수정 (분리된 상태와 연결) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reservationDate">예약 날짜</Label>
              <Input
                id="reservationDate"
                type="date"
                value={datePart}
                onChange={(e) => setDatePart(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reservationTime">예약 시간</Label>
              <Input
                id="reservationTime"
                type="time"
                value={timePart}
                onChange={(e) => setTimePart(e.target.value)}
              />
            </div>
          </div>

          {/* 차량 정보 */}
          <div>
            <Label htmlFor="carInfo">차량 정보</Label>
            <Input
              id="carInfo"
              value={formData.carInfo}
              onChange={(e) => handleInputChange('carInfo', e.target.value)}
            />
          </div>

          {/* 요청 사항 */}
          <div>
            <Label htmlFor="requestDetails">요청 사항</Label>
            <Textarea
              id="requestDetails"
              value={formData.requestDetails}
              onChange={(e) => handleInputChange('requestDetails', e.target.value)}
              placeholder="요청 사항 또는 카센터 메모를 입력하세요"
              rows={3}
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSubmit} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              수정 완료
            </Button>
           
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};