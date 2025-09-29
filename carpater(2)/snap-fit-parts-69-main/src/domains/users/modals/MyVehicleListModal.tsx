/**
 * 내 차량 목록 관리 모달
 * - 등록된 차량 목록을 보여주고, 신규 등록 및 수정 기능으로 연결하는 역할
 */
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserCarResDTO } from '@/services/user.api';
import { PlusCircle, Edit, Car, Loader2 } from 'lucide-react';

interface MyVehicleListModalProps {
  open: boolean;
  onClose: () => void;
  vehicles: UserCarResDTO[];
  isLoading: boolean;
  onAddNew: () => void; // 새 차량 등록 모달 열기 핸들러
  onEdit: (vehicle: UserCarResDTO) => void; // 수정 모달 열기 핸들러
}

export const MyVehicleListModal = ({ open, onClose, vehicles, isLoading, onAddNew, onEdit }: MyVehicleListModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>내 차량 관리</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vehicles.length > 0 ? (
            <div className="space-y-4">
              {vehicles.map(vehicle => (
                <Card key={vehicle.userCarId}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{vehicle.carModel}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.carNumber} ({vehicle.modelYear}년)</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                      <Edit className="w-3 h-3 mr-2" />
                      수정
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed rounded-lg">
              <Car className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">등록된 차량이 없습니다.</h3>
              <p className="mt-1 text-sm text-muted-foreground">첫 차량을 등록하여 견적을 받아보세요.</p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between gap-2">
           <Button variant="outline" onClick={onClose}>
             닫기
           </Button>
           <Button onClick={onAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            새 차량 등록하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};