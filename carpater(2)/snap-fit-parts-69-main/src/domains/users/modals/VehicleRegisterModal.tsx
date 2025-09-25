/**
 * 사용자 차량 등록 모달
 * - 차량 정보 추가 및 수정
 * - 차량 번호, 모델, 연식 등 관리
 * UserController의 차량 관리 API 기반
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Vehicle {
  vehicleId?: number;
  carNumber: string;
  carModel: string;
  carYear: number;
  manufacturer: string;
  fuelType: string;
  displacement?: string;
}

interface VehicleRegisterModalProps {
  open: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  onSubmit: (vehicleData: Vehicle) => void;
}

export const VehicleRegisterModal = ({ open, onClose, vehicle, onSubmit }: VehicleRegisterModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Vehicle>({
    carNumber: '',
    carModel: '',
    carYear: new Date().getFullYear(),
    manufacturer: '',
    fuelType: '',
    displacement: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      setFormData({
        carNumber: '',
        carModel: '',
        carYear: new Date().getFullYear(),
        manufacturer: '',
        fuelType: '',
        displacement: ''
      });
    }
  }, [vehicle, open]);

  const handleInputChange = (field: keyof Vehicle, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.carNumber || !formData.carModel || !formData.manufacturer) {
      toast({
        title: '입력 오류',
        description: '필수 항목을 모두 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    // API 호출: POST /api/users/vehicles or PUT /api/users/vehicles/{id}
    onSubmit(formData);
    toast({ title: vehicle ? '차량 정보가 수정되었습니다.' : '차량이 등록되었습니다.' });
    onClose();
  };

  const manufacturers = [
    '현대', '기아', '제네시스', '쌍용', 'GM한국', '르노삼성',
    'BMW', '벤츠', '아우디', '폭스바겐', '토요타', '혼다', '닛산',
    '테슬라', '포르쉐', '페라리', '람보르기니', '기타'
  ];

  const fuelTypes = [
    '가솔린', '디젤', '하이브리드', '전기', 'LPG', 'CNG'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{vehicle ? '차량 정보 수정' : '차량 등록'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="carNumber">차량 번호 *</Label>
            <Input
              id="carNumber"
              placeholder="예: 12가3456"
              value={formData.carNumber}
              onChange={(e) => handleInputChange('carNumber', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="manufacturer">제조사 *</Label>
            <Select value={formData.manufacturer} onValueChange={(value) => handleInputChange('manufacturer', value)}>
              <SelectTrigger>
                <SelectValue placeholder="제조사를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="carModel">모델명 *</Label>
            <Input
              id="carModel"
              placeholder="예: 아반떼, K5, BMW 3시리즈"
              value={formData.carModel}
              onChange={(e) => handleInputChange('carModel', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="carYear">연식</Label>
            <Select value={formData.carYear.toString()} onValueChange={(value) => handleInputChange('carYear', parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fuelType">연료 타입</Label>
            <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="연료 타입을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((fuelType) => (
                  <SelectItem key={fuelType} value={fuelType}>
                    {fuelType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="displacement">배기량</Label>
            <Input
              id="displacement"
              placeholder="예: 1600cc, 2000cc"
              value={formData.displacement}
              onChange={(e) => handleInputChange('displacement', e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              {vehicle ? '수정 완료' : '차량 등록'}
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