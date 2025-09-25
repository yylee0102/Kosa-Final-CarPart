/**
 * 카센터 정보 수정 모달
 * - 카센터 기본 정보 수정
 * - 운영시간, 연락처, 주소 등 업데이트
 * CarCenterController의 정보 수정 API 기반
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CenterInfo {
  centerId: string;
  centerName: string;
  businessRegistrationNumber: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  description?: string;
}

interface CenterInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  centerInfo?: CenterInfo;
  onUpdate: (updatedInfo: CenterInfo) => void;
}

export const CenterInfoEditModal = ({ open, onClose, centerInfo, onUpdate }: CenterInfoEditModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CenterInfo>({
    centerId: '',
    centerName: '',
    businessRegistrationNumber: '',
    address: '',
    phoneNumber: '',
    openingHours: '',
    description: ''
  });

  useEffect(() => {
    if (centerInfo) {
      setFormData(centerInfo);
    }
  }, [centerInfo]);

  const handleInputChange = (field: keyof CenterInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // API 호출: PUT /api/car-centers/my-info
    onUpdate(formData);
    toast({ title: '카센터 정보가 업데이트되었습니다.' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>카센터 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="centerName">카센터명</Label>
            <Input
              id="centerName"
              value={formData.centerName}
              onChange={(e) => handleInputChange('centerName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="businessNumber">사업자등록번호</Label>
            <Input
              id="businessNumber"
              value={formData.businessRegistrationNumber}
              onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">연락처</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="openingHours">운영시간</Label>
            <Input
              id="openingHours"
              value={formData.openingHours}
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
              placeholder="예: 09:00-18:00"
            />
          </div>
          <div>
            <Label htmlFor="description">소개</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="카센터 소개를 입력하세요"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              수정 완료
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