/**
 * 중고부품 수정 모달 (카센터 전용)
 * 카센터가 등록한 중고부품 정보를 수정하는 모달
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Package, DollarSign, Car, Save, X, Upload, ImageIcon } from 'lucide-react';
import carCenterApi, { UsedPartResDTO, UsedPartReqDTO } from '@/services/carCenter.api';

interface PartEditModalProps {
  open: boolean;
  onClose: () => void;
  part: UsedPartResDTO | null; // 수정할 부품의 원본 데이터
  onUpdate: () => void; // 수정 성공 시 부모 컴포넌트의 목록을 새로고침하기 위한 콜백
}

export const PartEditModal = ({ open, onClose, part, onUpdate }: PartEditModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 폼 상태
  const [partName, setPartName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]); // 새로 업로드할 이미지
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  
  // 호환 차량 정보 상태
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');

  // part prop이 변경될 때마다 폼 상태를 초기화
  useEffect(() => {
    if (part) {
      setPartName(part.partName);
      setDescription(part.description);
      setPrice(part.price);
      setCategory(part.category);
      setExistingImageUrls(part.imageUrls || []);
      setNewImages([]); // 모달 열릴 때마다 새 이미지 목록 초기화

      // compatibleCarModel 문자열을 분해하여 상태에 설정
      const compatibleParts = part.compatibleCarModel.split(' ');
      if (compatibleParts.length > 0) setCarBrand(compatibleParts[0] || '');
      if (compatibleParts.length > 1) setCarModel(compatibleParts[1] || '');
      if (compatibleParts.length > 2) setCarYear(compatibleParts[2] || '');

    }
  }, [part]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!part) return;

    // 유효성 검사
    if (!partName.trim() || !carModel.trim() || price <= 0) {
      toast({ title: '입력 오류', description: '부품명, 모델명, 가격은 필수 항목입니다.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const compatibleModel = `${carBrand} ${carModel} ${carYear}`.trim();

      const updateData: UsedPartReqDTO = {
        partName,
        description,
        price,
        category,
        compatibleCarModel: compatibleModel,
      };

      // API 호출
      await carCenterApi.updateUsedPart(part.partId, updateData, newImages);
      
      toast({
        title: '수정 완료',
        description: '중고부품 정보가 성공적으로 수정되었습니다.'
      });
      onUpdate(); // 부모 컴포넌트 목록 새로고침
      onClose();   // 모달 닫기
    } catch (error) {
      toast({
        title: '수정 실패',
        description: (error as Error).message || '중고부품 수정 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast({ title: '이미지 개수 초과', description: '최대 5개의 이미지만 업로드할 수 있습니다.', variant: 'destructive' });
      return;
    }
    setNewImages(files);
  };

  if (!part) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            중고부품 수정
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partName">부품명 *</Label>
              <Input id="partName" value={partName} onChange={(e) => setPartName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partCategory">부품 카테고리</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger><SelectValue placeholder="카테고리 선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="엔진">엔진</SelectItem>
                  <SelectItem value="브레이크">브레이크</SelectItem>
                  <SelectItem value="서스펜션">서스펜션</SelectItem>
                  <SelectItem value="전장">전장</SelectItem>
                  <SelectItem value="외장">외장</SelectItem>
                  <SelectItem value="내장">내장</SelectItem>
                  <SelectItem value="휠/타이어">휠/타이어</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 호환 차량 정보 */}
          <div className="space-y-2">
            <Label>호환 차량 정보 *</Label>
            <div className="grid grid-cols-3 gap-4">
                <Select onValueChange={setCarBrand} value={carBrand}>
                    <SelectTrigger><SelectValue placeholder="브랜드 선택" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="현대">현대</SelectItem>
                        <SelectItem value="기아">기아</SelectItem>
                        <SelectItem value="제네시스">제네시스</SelectItem>
                        <SelectItem value="쉐보레">쉐보레</SelectItem>
                        <SelectItem value="르노삼성">르노삼성</SelectItem>
                        <SelectItem value="쌍용">쌍용</SelectItem>
                        <SelectItem value="BMW">BMW</SelectItem>
                        <SelectItem value="벤츠">벤츠</SelectItem>
                        <SelectItem value="아우디">아우디</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                </Select>
                <Input value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="모델명" required />
                <Input value={carYear} onChange={(e) => setCarYear(e.target.value)} placeholder="연식" />
            </div>
          </div>
          
          {/* 가격 */}
           <div className="space-y-2">
              <Label htmlFor="price">가격 *</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} min="0" required />
            </div>

          {/* 상세 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">상세 설명</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          
          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>부품 이미지 (새로 등록 시 기존 이미지는 교체됩니다)</Label>
            {existingImageUrls.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-2">기존 이미지</p>
                    <div className="flex flex-wrap gap-2">
                        {existingImageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`기존이미지 ${index+1}`} className="w-24 h-24 object-cover rounded-md border" />
                        ))}
                    </div>
                </div>
            )}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <Input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Label htmlFor="images" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild><span>새 이미지 선택</span></Button>
                </Label>
              </div>
              {newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium">새로 선택된 이미지: {newImages.length}개</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newImages.map((file, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">{file.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};