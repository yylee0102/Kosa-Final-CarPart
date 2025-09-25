/**
 * 예약 상세 관리 모달
 * - 예약 상태 변경 (대기중, 확정, 완료, 취소)
 * - 예약 정보 수정
 * - 고객 연락 기능
 * CarCenterController의 예약 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Phone, Car, FileText } from 'lucide-react';

interface Reservation {
  reservationId: number;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carNumber: string;
  reservationDate: string;
  reservationTime: string;
  serviceType: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

interface ReservationManageModalProps {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation;
  onUpdate: (updatedReservation: Reservation) => void;
}

export const ReservationManageModal = ({ open, onClose, reservation, onUpdate }: ReservationManageModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Reservation>({
    reservationId: 0,
    customerName: '',
    customerPhone: '',
    carModel: '',
    carNumber: '',
    reservationDate: '',
    reservationTime: '',
    serviceType: '',
    status: 'PENDING',
    notes: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData(reservation);
    }
  }, [reservation]);

  const handleInputChange = (field: keyof Reservation, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleSubmit = () => {
    // API 호출: PUT /api/car-centers/reservations/{reservationId}
    onUpdate(formData);
    toast({ title: '예약 정보가 업데이트되었습니다.' });
    onClose();
  };

  const handleCall = () => {
    window.open(`tel:${formData.customerPhone}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'CONFIRMED': return '확정';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

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
              <span className="font-medium">예약 #{formData.reservationId}</span>
              <Badge className={getStatusColor(formData.status)}>
                {getStatusText(formData.status)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{formData.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{formData.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span>{formData.carModel} ({formData.carNumber})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formData.reservationDate}</span>
              </div>
            </div>
          </div>

          {/* 예약 상태 변경 */}
          <div>
            <Label htmlFor="status">예약 상태</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">대기중</SelectItem>
                <SelectItem value="CONFIRMED">확정</SelectItem>
                <SelectItem value="COMPLETED">완료</SelectItem>
                <SelectItem value="CANCELLED">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 예약 시간 수정 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reservationDate">예약 날짜</Label>
              <Input
                id="reservationDate"
                type="date"
                value={formData.reservationDate}
                onChange={(e) => handleInputChange('reservationDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reservationTime">예약 시간</Label>
              <Input
                id="reservationTime"
                type="time"
                value={formData.reservationTime}
                onChange={(e) => handleInputChange('reservationTime', e.target.value)}
              />
            </div>
          </div>

          {/* 서비스 유형 */}
          <div>
            <Label htmlFor="serviceType">서비스 유형</Label>
            <Input
              id="serviceType"
              value={formData.serviceType}
              onChange={(e) => handleInputChange('serviceType', e.target.value)}
            />
          </div>

          {/* 특이사항 */}
          <div>
            <Label htmlFor="notes">특이사항</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="예약 관련 특이사항을 입력하세요"
              rows={3}
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              수정 완료
            </Button>
            <Button variant="outline" onClick={handleCall}>
              <Phone className="h-4 w-4 mr-2" />
              전화하기
            </Button>
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};