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
import { Calendar, User, Phone, Car, FileText } from 'lucide-react';
import carCenterApi, { ReservationResDTO, ReservationReqDTO } from '@/services/carCenter.api';

// props로 받을 예약 정보 타입 (API의 응답 DTO와 일치)
type Reservation = ReservationResDTO;

interface ReservationManageModalProps {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  onUpdate: () => void; // 성공 시 부모에게 알리는 콜백
}

export const ReservationManageModal = ({ open, onClose, reservation, onUpdate }: ReservationManageModalProps) => {
  const { toast } = useToast();
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState<Partial<Reservation>>({});
  const [datePart, setDatePart] = useState('');
  const [timePart, setTimePart] = useState('');

  // 모달이 열리거나 reservation 데이터가 바뀔 때 상태 초기화
  useEffect(() => {
    if (reservation) {
      setFormData(reservation);
      
      if (reservation.reservationDate) {
        // ISO 문자열을 날짜('YYYY-MM-DD')와 시간('HH:mm')으로 분리
        const dateObj = new Date(reservation.reservationDate);
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

  const handleInputChange = (field: keyof Omit<Reservation, 'reservationId' | 'reservationDate' | 'centerId'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!reservation) return;
    if (!datePart || !timePart) {
      toast({ title: "예약 날짜와 시간을 모두 입력해주세요.", variant: "destructive"});
      return;
    }

    // 분리된 날짜와 시간을 다시 LocalDateTime 형식의 문자열로 조합
    const combinedDateTime = `${datePart}T${timePart}:00`;

    // API 요청을 위한 DTO 생성
    const updateData: ReservationReqDTO = {
      customerName: formData.customerName || '',
      customerPhone: formData.customerPhone || '',
      carInfo: formData.carInfo || '',
      reservationDate: combinedDateTime,
      requestDetails: formData.requestDetails || ''
    };

    try {
      // API 호출
      await carCenterApi.updateReservation(reservation.reservationId, updateData);
      toast({ title: '예약 정보가 성공적으로 업데이트되었습니다.' });
      onUpdate(); // 부모 컴포-넌트에 성공 알림 (목록 새로고침)
      onClose();  // 모달 닫기
    } catch(error) {
      toast({
        title: "업데이트 실패",
        description: (error as Error).message,
        variant: "destructive"
      });
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
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-lg">예약 #{reservation.reservationId}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /><span>{formData.customerName}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /><span>{formData.customerPhone}</span></div>
              <div className="flex items-center gap-2"><Car className="h-4 w-4 text-gray-500" /><span>{formData.carInfo}</span></div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" /><span>{`${datePart} ${timePart}`}</span></div>
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
              value={formData.carInfo || ''}
              onChange={(e) => handleInputChange('carInfo', e.target.value)}
            />
          </div>

          {/* 요청 사항 */}
          <div>
            <Label htmlFor="requestDetails">요청 사항</Label>
            <Textarea
              id="requestDetails"
              value={formData.requestDetails || ''}
              onChange={(e) => handleInputChange('requestDetails', e.target.value)}
              placeholder="요청 사항 또는 카센터 메모를 입력하세요"
              rows={3}
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              <FileText className="h-4 w-4 mr-2" />
              수정 완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};