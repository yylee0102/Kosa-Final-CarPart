/**
 * 견적 요청 작성 모달
 * - 차량 정보 선택 및 문제 상황 기술
 * - 희망 날짜 및 지역 설정
 * - 이미지 첨부 기능
 * UserController의 견적 요청 API 기반
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Car, Calendar, MapPin, Camera, X } from 'lucide-react';

interface Vehicle {
  vehicleId: number;
  carNumber: string;
  carModel: string;
  carYear: number;
  manufacturer: string;
}

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (requestData: any) => void;
}

export const QuoteRequestModal = ({ open, onClose, onSubmit }: QuoteRequestModalProps) => {
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Mock 차량 데이터 - 실제로는 API에서 가져옴
  const userVehicles: Vehicle[] = [
    {
      vehicleId: 1,
      carNumber: '12가3456',
      carModel: '아반떼',
      carYear: 2020,
      manufacturer: '현대'
    },
    {
      vehicleId: 2,
      carNumber: '34나5678',
      carModel: 'K5',
      carYear: 2019,
      manufacturer: '기아'
    }
  ];

  useEffect(() => {
    if (open) {
      // 기본 희망일을 내일로 설정
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [open]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: '이미지 제한',
        description: '최대 5개까지 업로드 가능합니다.',
        variant: 'destructive'
      });
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // 미리보기 URL 생성
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setImagePreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedVehicle || !issueDescription || !preferredDate || !location) {
      toast({
        title: '입력 오류',
        description: '모든 필수 항목을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    const selectedVehicleInfo = userVehicles.find(v => v.vehicleId === selectedVehicle);
    
    const requestData = {
      vehicleId: selectedVehicle,
      issueDescription,
      preferredDate,
      location,
      images
    };

    // API 호출: POST /api/users/quote-requests
    onSubmit(requestData);
    toast({ title: '견적 요청이 성공적으로 등록되었습니다.' });
    
    // 폼 초기화
    setSelectedVehicle(null);
    setIssueDescription('');
    setLocation('');
    setImages([]);
    setImagePreviewUrls([]);
    
    onClose();
  };

  const locations = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시',
    '울산광역시', '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도',
    '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>견적 요청하기</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 차량 선택 */}
          <div>
            <Label htmlFor="vehicle">차량 선택 *</Label>
            <Select value={selectedVehicle?.toString()} onValueChange={(value) => setSelectedVehicle(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="차량을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {userVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>{vehicle.manufacturer} {vehicle.carModel} ({vehicle.carNumber})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userVehicles.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                먼저 마이페이지에서 차량을 등록해주세요.
              </p>
            )}
          </div>

          {/* 문제 상황 */}
          <div>
            <Label htmlFor="issueDescription">문제 상황 *</Label>
            <Textarea
              id="issueDescription"
              placeholder="차량에 발생한 문제나 원하는 서비스를 상세히 설명해주세요"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* 희망 날짜 */}
          <div>
            <Label htmlFor="preferredDate">희망 날짜 *</Label>
            <Input
              id="preferredDate"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* 지역 */}
          <div>
            <Label htmlFor="location">지역 *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{loc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <Label>이미지 첨부 (최대 5개)</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Camera className="h-4 w-4 mr-2" />
                    사진 선택하기
                  </span>
                </Button>
              </label>
            </div>
            
            {/* 이미지 미리보기 */}
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              견적 요청하기
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