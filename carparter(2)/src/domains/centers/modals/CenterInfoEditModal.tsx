/**
 * 카센터 정보 수정 모달
 * - 카센터 기본 정보 수정
 * - [수정] Daum 우편번호 API를 연동하여 주소 검색 기능 추가
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import carCenterApi, { CarCenterResponse } from '@/services/carCenter.api';
import { useDaumPostcodePopup } from 'react-daum-postcode'; // ✅ Daum Postcode 훅 임포트

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
}

export const CenterInfoEditModal = ({ open, onClose, onUpdate }: CenterInfoEditModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<CarCenterResponse>>({});
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Daum Postcode 팝업 초기화
  const openPostcode = useDaumPostcodePopup();

  useEffect(() => {
    if (open) {
      const fetchCenterInfo = async () => {
        setIsLoading(true);
        try {
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
  }, [open, toast]);

  const handleInputChange = (field: keyof CenterUpdateInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ 주소 검색 완료 후 실행될 콜백 함수
  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';
    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    // 상태 업데이트
    handleInputChange("address", fullAddress);
  };

  // ✅ '주소 검색' 버튼 클릭 시 실행될 함수
  const handleAddressSearch = () => {
    openPostcode({ onComplete: handleCompletePostcode });
  };

  const handleSubmit = () => {
    const updateData: CenterUpdateInfo = {
      centerName: formData.centerName,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
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
          <DialogHeader><DialogTitle>카센터 정보 수정</DialogTitle></DialogHeader>
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
        <div className="space-y-4 py-4">
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
              disabled
            />
          </div>
          {/* ✅ [수정] 주소 입력 필드와 검색 버튼 */}
          <div>
            <Label htmlFor="address">주소</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={formData.address || ''}
                readOnly // 직접 수정을 막습니다.
                placeholder="아래 버튼을 눌러 주소를 검색하세요"
              />
              <Button type="button" variant="outline" onClick={handleAddressSearch}>
                주소 검색
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="phoneNumber">연락처</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="openingHours">운영시간</Label>
            <Input
              id="openingHours"
              value={formData.openingHours || ''}
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
              placeholder="예: 09:00-18:00"
            />
          </div>
          <div>
            <Label htmlFor="description">소개</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="카센터 소개를 입력하세요"
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSubmit} className="flex-1">
              수정 완료
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};