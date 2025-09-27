/**
 * 중고부품 등록 모달 (카센터 전용)
 * 카센터가 중고부품을 등록할 수 있는 모달
 */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Package, DollarSign, Car, Save, X, Upload, ImageIcon } from 'lucide-react';

// ✅ [수정] CenterMyPage에서 사용할 데이터 타입을 명확하게 정의하고 export 합니다.
export interface PartCreateData {
  name: string;
  description: string;
  price: number;
  category: string;
  compatibleModel: string;
  images: File[];
}

interface PartCreateModalProps {
  open: boolean;
  onClose: () => void;
  // ✅ [수정] onSubmit prop의 타입을 any 대신 정의된 PartCreateData로 변경합니다.
  onSubmit: (partData: PartCreateData) => void;
}

export const PartCreateModal = ({ open, onClose, onSubmit }: PartCreateModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ [수정] formData의 구조를 최종적으로 필요한 데이터(PartCreateData)와 유사하게 맞춥니다.
  // compatibleModel을 만들기 위한 필드들을 별도로 관리합니다.
  const [partName, setPartName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');


  const resetForm = () => {
      setPartName('');
      setDescription('');
      setPrice(0);
      setCategory('');
      setImages([]);
      setCarBrand('');
      setCarModel('');
      setCarYear('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!partName.trim()) {
      toast({ title: '입력 오류', description: '부품명을 입력해주세요.', variant: 'destructive' });
      return;
    }
    if (!carModel.trim()) {
      toast({ title: '입력 오류', description: '차량 모델을 입력해주세요.', variant: 'destructive' });
      return;
    }
    if (price <= 0) {
      toast({ title: '입력 오류', description: '가격을 올바르게 입력해주세요.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ [수정] 여러 입력 필드를 조합하여 compatibleModel 문자열을 생성합니다.
      const compatibleModel = `${carBrand} ${carModel} ${carYear}`.trim();

      // ✅ [수정] 정의된 PartCreateData 인터페이스에 맞게 데이터를 조립하여 부모 컴포넌트로 전달합니다.
      const partData: PartCreateData = {
        name: partName,
        description,
        price,
        category,
        compatibleModel,
        images,
      };

      // 부모 컴포넌트의 onSubmit 함수를 호출합니다.
      await onSubmit(partData);
      
      toast({
        title: '등록 완료',
        description: '중고부품이 성공적으로 등록되었습니다.'
      });
      resetForm(); // 폼 초기화
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('중고부품 등록 실패:', error);
      toast({
        title: '등록 실패',
        description: (error as Error).message || '중고부품 등록 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast({
        title: '이미지 개수 초과',
        description: '최대 5개의 이미지만 업로드할 수 있습니다.',
        variant: 'destructive'
      });
      return;
    }
    setImages(files);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            중고부품 등록
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partName" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                부품명 *
              </Label>
              <Input
                id="partName"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="예: LF 쏘나타 순정 18인치 휠"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partCategory">부품 카테고리</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="엔진">엔진 부품</SelectItem>
                  <SelectItem value="브레이크">브레이크 부품</SelectItem>
                  <SelectItem value="서스펜션">서스펜션</SelectItem>
                  <SelectItem value="전장">전장 부품</SelectItem>
                  <SelectItem value="외장">외장 부품</SelectItem>
                  <SelectItem value="내장">내장 부품</SelectItem>
                  <SelectItem value="휠/타이어">타이어/휠</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 호환 차량 정보 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Car className="h-4 w-4" /> 호환 차량 정보 *</Label>
            <div className="grid grid-cols-3 gap-4">
                <Select onValueChange={setCarBrand}>
                    <SelectTrigger>
                        <SelectValue placeholder="브랜드 선택" />
                    </SelectTrigger>
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
                <Input
                    id="carModel"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="모델명 (예: 쏘나타)"
                    required
                />
                <Input
                    id="carYear"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                    placeholder="연식 (예: 2020)"
                />
            </div>
          </div>
          
        {/* 가격 */}
<div className="space-y-2">
  <Label htmlFor="price" className="flex items-center gap-2">
    <span className="text-lg">₩</span>
    가격 *
  </Label>
  <Input
    id="price"
    type="number"
    value={price}
    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
    placeholder="가격 입력"
    min="0"
    required
  />
</div>

          {/* 상세 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">상세 설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="부품의 상태, 특징, 주의사항 등을 상세히 입력해주세요."
              rows={4}
            />
          </div>
          
          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label htmlFor="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              부품 이미지 (최대 5개)
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label htmlFor="images" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>이미지 선택</span>
                  </Button>
                </Label>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG 파일 업로드 가능
                </p>
              </div>
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium">선택된 이미지: {images.length}개</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((file, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {file.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};