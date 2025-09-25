import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PartCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (partData: any) => void;
}

export default function PartCreateModal({ open, onClose, onSubmit }: PartCreateModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    description: "",
    oem: "",
    brand: "",
    partNumber: "",
    year: "",
    model: "",
    engine: "",
    compatible: [""],
    sellerType: "개인",
    location: "",
    phone: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categories = [
    "엔진부품", "미션/구동계", "현가장치", "제동장치", "조향장치",
    "전기계통", "냉각장치", "연료장치", "배기장치", "차체부품",
    "내장부품", "외장부품", "타이어/휠", "오일/소모품", "기타"
  ];

  const conditions = ["신품", "중고A급", "중고B급", "중고C급"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // 최대 10개 이미지 제한
    if (images.length + files.length > 10) {
      alert("이미지는 최대 10개까지 업로드 가능합니다.");
      return;
    }

    // 파일 크기 체크 (각 5MB 제한)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("이미지 파일은 5MB 이하만 업로드 가능합니다.");
      return;
    }

    setImages(prev => [...prev, ...files]);

    // 미리보기 생성
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addCompatibleField = () => {
    setFormData(prev => ({
      ...prev,
      compatible: [...prev.compatible, ""]
    }));
  };

  const updateCompatible = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      compatible: prev.compatible.map((item, i) => i === index ? value : item)
    }));
  };

  const removeCompatible = (index: number) => {
    setFormData(prev => ({
      ...prev,
      compatible: prev.compatible.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.category || !formData.condition || !formData.price) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // TODO: API 연결 시 실제 업로드 로직 구현
    const partData = {
      ...formData,
      images: images, // 실제로는 서버에 업로드 후 URL 받아와야 함
      compatible: formData.compatible.filter(c => c.trim() !== ""),
      price: parseInt(formData.price)
    };

    onSubmit(partData);
    onClose();
    
    // 폼 초기화
    setFormData({
      title: "",
      category: "",
      condition: "",
      price: "",
      description: "",
      oem: "",
      brand: "",
      partNumber: "",
      year: "",
      model: "",
      engine: "",
      compatible: [""],
      sellerType: "개인",
      location: "",
      phone: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="부품 등록"
      description="판매하실 중고부품 정보를 입력해주세요"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이미지 업로드 */}
        <div className="space-y-3">
          <Label htmlFor="images">상품 이미지 *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 업로드 버튼 */}
            {images.length < 10 && (
              <label htmlFor="image-upload" className="aspect-square border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center cursor-pointer hover:bg-surface-container transition-colors">
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-on-surface-variant" />
                  <span className="text-xs text-on-surface-variant">
                    {images.length}/10
                  </span>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* 이미지 미리보기 */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={preview} 
                  alt={`상품 이미지 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                    대표
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            첫 번째 이미지가 대표 이미지로 설정됩니다. (최대 10개, 각 5MB 이하)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-on-surface">기본 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">상품명 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="예: 현대 아반떼 헤드라이트 좌측"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>상품 상태 *</Label>
              <RadioGroup 
                value={formData.condition} 
                onValueChange={(value) => handleInputChange("condition", value)}
                className="flex flex-wrap gap-4"
              >
                {conditions.map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <RadioGroupItem value={condition} id={condition} />
                    <Label htmlFor={condition}>{condition}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격 *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-on-surface">상세 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="oem">OEM 번호</Label>
              <Input
                id="oem"
                value={formData.oem}
                onChange={(e) => handleInputChange("oem", e.target.value)}
                placeholder="예: 92101-3X000"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="brand">브랜드</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="현대"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partNumber">부품번호</Label>
                <Input
                  id="partNumber"
                  value={formData.partNumber}
                  onChange={(e) => handleInputChange("partNumber", e.target.value)}
                  placeholder="부품번호"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="year">연식</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">차종</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="아반떼"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="engine">엔진</Label>
              <Input
                id="engine"
                value={formData.engine}
                onChange={(e) => handleInputChange("engine", e.target.value)}
                placeholder="1.6 가솔린"
              />
            </div>
          </div>
        </div>

        {/* 호환 차종 */}
        <div className="space-y-3">
          <Label>호환 차종</Label>
          {formData.compatible.map((compatible, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={compatible}
                onChange={(e) => updateCompatible(index, e.target.value)}
                placeholder="예: 2018-2020 아반떼"
                className="flex-1"
              />
              {formData.compatible.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCompatible(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCompatibleField}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            호환 차종 추가
          </Button>
        </div>

        {/* 상품 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">상품 설명</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="상품의 상태, 특이사항 등을 자세히 설명해주세요."
            rows={4}
          />
        </div>

        {/* 판매자 정보 */}
        <div className="space-y-4">
          <h3 className="font-medium text-on-surface">판매자 정보</h3>
          
          <div className="space-y-2">
            <Label>판매자 유형</Label>
            <RadioGroup 
              value={formData.sellerType} 
              onValueChange={(value) => handleInputChange("sellerType", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="개인" id="individual" />
                <Label htmlFor="individual">개인</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="업체" id="business" />
                <Label htmlFor="business">업체</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="location">지역 *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="서울 강남구"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">연락처 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            등록하기
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}