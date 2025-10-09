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
// ✅ API 서비스에서 DTO 타입을 직접 가져와서 사용합니다.
import { UserCarReqDTO, UserCarResDTO } from '@/services/user.api';

// interface Vehicle {
//   vehicleId?: number;
//   carNumber: string;
//   carModel: string;
//   carYear: number;
//   manufacturer: string;
//   fuelType: string;
//   displacement?: string;
// }

// ✅ Props 인터페이스를 API DTO에 맞게 수정합니다.
interface VehicleRegisterModalProps {
  open: boolean;
  onClose: () => void;
  // 수정할 때는 UserCarResDTO를 받고, 신규 등록 시에는 undefined를 받습니다.
  vehicle?: UserCarResDTO; 
  // 제출 시 UserCarReqDTO 타입을 전달합니다.
  onSubmit: (vehicleData: UserCarReqDTO) => void;
}

export const VehicleRegisterModal = ({ open, onClose, vehicle, onSubmit }: VehicleRegisterModalProps) => {
  const { toast } = useToast();
  // ✅ [수정] formData의 타입을 API 요청 DTO인 UserCarReqDTO로 변경하고, 초기값도 맞춥니다.
  const [formData, setFormData] = useState<UserCarReqDTO>({
    carModel: '',
    carNumber: '',
    modelYear: new Date().getFullYear(),
  });

  useEffect(() => {
    // 모달이 열릴 때마다 상태를 초기화
    if (vehicle) {
      setFormData({
          carModel: vehicle.carModel,
          carNumber: vehicle.carNumber,
          modelYear: vehicle.modelYear,
        });
    } else {
      setFormData({
          carModel: '',
          carNumber: '',
          modelYear: new Date().getFullYear(),
        });
    }
  }, [vehicle, open]);

  // ✅ [수정] handleInputChange의 field 타입을 UserCarReqDTO의 키로 제한
  const handleInputChange = (field: keyof UserCarReqDTO, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



    const handleSubmit = () => {
        // .trim()을 사용해 입력값 앞뒤의 공백을 제거하고 내용이 있는지 확인합니다.
        if (!formData.carNumber.trim() || !formData.carModel.trim()) {  
          // alert으로 사용자에게 알립니다.
        alert('차량 번호와 모델명은 필수 입력 항목입니다.');
        // return을 통해 함수 실행을 중단시켜 등록을 막습니다.
        return; 
      }
      // 유효성 검사 통과 시에만 등록 진행
    onSubmit(formData);
    // API 호출: POST /api/users/vehicles or PUT /api/users/vehicles/{id}
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
            {/* ✅ [수정] carYear -> modelYear로 필드명과 상태 연결을 모두 변경 */}
            <Label htmlFor="modelYear">연식</Label>
            <Select value={formData.modelYear.toString()} onValueChange={(value) => handleInputChange('modelYear', parseInt(value))}>
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