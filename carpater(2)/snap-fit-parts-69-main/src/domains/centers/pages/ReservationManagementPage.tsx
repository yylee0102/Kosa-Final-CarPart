/**
 * 카센터 예약 관리 페이지
 * - 예약 목록 조회, 등록, 수정, 삭제
 * - 오늘 예약 건수 확인
 * CarCenterController의 예약 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Phone, Car, Plus, Edit, Trash2 } from 'lucide-react';

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

export const ReservationManagementPage = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerPhone: '',
    carModel: '',
    carNumber: '',
    reservationDate: '',
    reservationTime: '',
    serviceType: '',
    notes: ''
  });

  useEffect(() => {
    loadReservations();
    loadTodayCount();
  }, []);

  const loadReservations = () => {
    // Mock data - 실제로는 API 호출
    const mockReservations: Reservation[] = [
      {
        reservationId: 1,
        customerName: '김고객',
        customerPhone: '010-1234-5678',
        carModel: '아반떼',
        carNumber: '12가3456',
        reservationDate: '2024-01-15',
        reservationTime: '10:00',
        serviceType: '정기점검',
        status: 'CONFIRMED',
        notes: '엔진오일 교체 필요'
      },
      {
        reservationId: 2,
        customerName: '이고객',
        customerPhone: '010-2345-6789',
        carModel: '소나타',
        carNumber: '34나5678',
        reservationDate: '2024-01-15',
        reservationTime: '14:00',
        serviceType: '브레이크 점검',
        status: 'PENDING'
      }
    ];
    setReservations(mockReservations);
  };

  const loadTodayCount = () => {
    // Mock data - 실제로는 API 호출
    setTodayCount(3);
  };

  const handleCreateReservation = () => {
    // API 호출: POST /api/car-centers/reservations
    const reservation: Reservation = {
      reservationId: Date.now(),
      ...newReservation,
      status: 'PENDING'
    };
    setReservations(prev => [...prev, reservation]);
    setNewReservation({
      customerName: '',
      customerPhone: '',
      carModel: '',
      carNumber: '',
      reservationDate: '',
      reservationTime: '',
      serviceType: '',
      notes: ''
    });
    setIsCreateModalOpen(false);
    toast({ title: '예약이 등록되었습니다.' });
  };

  const handleUpdateReservation = (reservation: Reservation) => {
    // API 호출: PUT /api/car-centers/reservations/{reservationId}
    setReservations(prev => 
      prev.map(r => r.reservationId === reservation.reservationId ? reservation : r)
    );
    setEditingReservation(null);
    toast({ title: '예약이 수정되었습니다.' });
  };

  const handleDeleteReservation = (reservationId: number) => {
    // API 호출: DELETE /api/car-centers/reservations/{reservationId}
    setReservations(prev => prev.filter(r => r.reservationId !== reservationId));
    toast({ title: '예약이 삭제되었습니다.' });
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
    <PageContainer>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">예약 관리</h1>
            <p className="text-muted-foreground">고객 예약을 관리하고 일정을 확인하세요</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                새 예약 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 예약 등록</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">고객명</Label>
                    <Input
                      id="customerName"
                      value={newReservation.customerName}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, customerName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">연락처</Label>
                    <Input
                      id="customerPhone"
                      value={newReservation.customerPhone}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, customerPhone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carModel">차량 모델</Label>
                    <Input
                      id="carModel"
                      value={newReservation.carModel}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, carModel: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carNumber">차량 번호</Label>
                    <Input
                      id="carNumber"
                      value={newReservation.carNumber}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, carNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reservationDate">예약 날짜</Label>
                    <Input
                      id="reservationDate"
                      type="date"
                      value={newReservation.reservationDate}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, reservationDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reservationTime">예약 시간</Label>
                    <Input
                      id="reservationTime"
                      type="time"
                      value={newReservation.reservationTime}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, reservationTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="serviceType">서비스 유형</Label>
                  <Input
                    id="serviceType"
                    value={newReservation.serviceType}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, serviceType: e.target.value }))}
                    placeholder="예: 정기점검, 브레이크 점검 등"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">특이사항</Label>
                  <Textarea
                    id="notes"
                    value={newReservation.notes}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="추가 정보나 요청사항을 입력하세요"
                  />
                </div>
                <Button onClick={handleCreateReservation} className="w-full">
                  예약 등록
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">오늘 예약</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayCount}건</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 예약</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}건</div>
            </CardContent>
          </Card>
        </div>

        {/* 예약 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>예약 목록</CardTitle>
            <CardDescription>등록된 모든 예약을 확인하고 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.reservationId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{reservation.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{reservation.customerPhone}</span>
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusText(reservation.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{reservation.carModel} ({reservation.carNumber})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{reservation.reservationDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{reservation.reservationTime}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">서비스: </span>
                        {reservation.serviceType}
                      </div>
                      {reservation.notes && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">특이사항: </span>
                          {reservation.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingReservation(reservation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReservation(reservation.reservationId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};