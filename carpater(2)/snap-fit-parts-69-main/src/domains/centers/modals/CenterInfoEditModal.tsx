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
import carCenterApi from '@/services/carCenter.api'; // [수정] API 서비스 import
import { CarCenterResponse } from '@/services/carCenter.api'; // [수정] 응답 타입 import

// [수정] onUpdate 콜백에서 사용할 타입으로 변경
// API 응답 DTO와 필드가 다를 수 있으므로 명시적으로 정의합니다.
export interface CenterUpdateInfo {
  centerName?: string;
  address?: string;
  phoneNumber?: string;
  openingHours?: string;
  description?: string;
}

interface CenterInfoEditModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedInfo: CenterUpdateInfo) => void;
  // [수정] centerInfo prop 제거
}

export const CenterInfoEditModal = ({ open, onClose, onUpdate }: CenterInfoEditModalProps) => {
  const { toast } = useToast();
  // [수정] 초기 상태는 비워둡니다. CarCenterResponse 타입으로 변경
  const [formData, setFormData] = useState<Partial<CarCenterResponse>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 모달이 열릴 때만 데이터를 불러옵니다.
    if (open) {
      const fetchCenterInfo = async () => {
        setIsLoading(true);
        try {
          // [수정] API를 호출하여 현재 카센터 정보를 가져옵니다.
          const currentInfo = await carCenterApi.getMyCenterInfo();
          setFormData(currentInfo);
        } catch (error) {
          toast({
            title: '정보를 불러오는 데 실패했습니다.',
            description: (error as Error).message,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCenterInfo();
    }
  }, [open, toast]); // [수정] open 상태가 변경될 때마다 실행

  const handleInputChange = (field: keyof CenterUpdateInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // API에 보낼 데이터만 추립니다.
    const updateData: CenterUpdateInfo = {
      centerName: formData.centerName,
      address: formData.address,
      phoneNumber: formData.phoneNumber, // DTO 필드명에 맞게 'phone'으로 수정
      openingHours: formData.openingHours,
      description: formData.description,
    };
    onUpdate(updateData);
    onClose();
  };
  
  if (isLoading) {
      return (
          <Dialog open={open} onOpenChange={onClose}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>카센터 정보 수정</DialogTitle>
                  </DialogHeader>
                  <div>정보를 불러오는 중...</div>
              </DialogContent>
          </Dialog>
      );
  }

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
              value={formData.centerName || ''}
              onChange={(e) => handleInputChange('centerName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="businessNumber">사업자등록번호</Label>
            <Input
              id="businessNumber"
              value={formData.businessRegistrationNumber || ''}
              disabled // 사업자번호는 수정 불가 항목으로 유지
            />
          </div>
          <div>
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">연락처</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber || ''} // [수정] DTO 필드명에 맞게 'phone'으로 수정
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="openingHours">운영시간</Label>
            <Input
              id="openingHours"
              value={formData.openingHours || ''} // [수정] API 응답에 이 필드가 없다면 추가 필요
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
              placeholder="예: 09:00-18:00"
            />
          </div>
          <div>
            <Label htmlFor="description">소개</Label>
            <Textarea
              id="description"
              value={formData.description || ''} // [수정] API 응답에 이 필드가 없다면 추가 필요
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