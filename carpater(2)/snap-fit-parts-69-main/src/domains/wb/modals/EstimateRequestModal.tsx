import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Car, Wrench } from "lucide-react";

interface EstimateRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function EstimateRequestModal({ open, onClose, onSubmit }: EstimateRequestModalProps) {
  const [formData, setFormData] = useState({
    // 차량 정보
    carBrand: "",
    carModel: "",
    carYear: "",
    mileage: "",
    
    // 부품 정보
    partCategory: "",
    partName: "",
    partCondition: "",
    isUrgent: false,
    
    // 작업 정보
    workType: "",
    location: "",
    preferredDate: "",
    budget: "",
    
    // 상세 설명
    description: "",
    
    // 연락처
    contactMethod: "phone",
    agreePrivacy: false
  });

  const carBrands = [
    "현대", "기아", "쉐보레", "르노삼성", "쌍용", "제네시스",
    "벤츠", "BMW", "아우디", "폭스바겐", "렉서스", "토요타",
    "혼다", "닛산", "마쓰다", "기타"
  ];

  const partCategories = [
    "엔진부품", "미션/구동계", "현가장치", "제동장치", "조향장치",
    "전기계통", "냉각장치", "연료장치", "배기장치", "차체부품",
    "내장부품", "외장부품", "타이어/휠", "오일/소모품", "기타"
  ];

  const workTypes = [
    "부품 구매만", "부품 구매 + 교체 작업", "교체 작업만",
    "수리/정비", "진단", "기타"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreePrivacy) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    // TODO: API 연결 - 견적 요청 등록
    // POST /api/estimates/request
    console.log("견적 요청 데이터:", formData);
    
    onSubmit?.(formData);
    alert("견적 요청이 등록되었습니다!\n카센터에서 연락드릴 예정입니다.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            차량부품등록
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 차종 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-on-surface">차종</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carBrand">제조사</Label>
                <Select value={formData.carBrand} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, carBrand: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="차량 제조사를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel">모델명</Label>
                <Input
                  id="carModel"
                  placeholder="차량 모델명을 입력하세요"
                  value={formData.carModel}
                  onChange={(e) => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carYear">연식</Label>
                <Input
                  id="carYear"
                  placeholder="ex) 2020"
                  value={formData.carYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, carYear: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">주행거리</Label>
                <Input
                  id="mileage"
                  placeholder="ex) 50,000km"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 부품 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-on-surface">부품 명</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partCategory">부품 종류</Label>
                <Select value={formData.partCategory} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, partCategory: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="부품 종류를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {partCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partName">부품 이름</Label>
                <Input
                  id="partName"
                  placeholder="원하는 부품명을 입력하세요"
                  value={formData.partName}
                  onChange={(e) => setFormData(prev => ({ ...prev, partName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partCondition">부품 상태</Label>
              <Select value={formData.partCondition} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, partCondition: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="원하는 부품 상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="신품">신품</SelectItem>
                  <SelectItem value="중고A급">중고A급</SelectItem>
                  <SelectItem value="중고B급">중고B급</SelectItem>
                  <SelectItem value="중고C급">중고C급</SelectItem>
                  <SelectItem value="상관없음">상관없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-on-surface">가격</h3>
            
            <div className="space-y-2">
              <Label htmlFor="budget">희망 예산</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="budget"
                  type="number"
                  placeholder="희망 예산을 입력하세요"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                />
                <span className="text-on-surface-variant">원</span>
              </div>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="space-y-4">
            <h3 className="font-medium text-on-surface">상품설명</h3>
            
            <div className="space-y-2">
              <Textarea
                placeholder="필요한 부품에 대한 상세한 설명을 입력해주세요.&#10;(예: 정확한 부품명, 교체 이유, 특별 요구사항 등)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isUrgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isUrgent: checked as boolean }))
                }
              />
              <Label htmlFor="isUrgent" className="text-sm">
                긴급상품 등록 우선순위에 추가합니다
              </Label>
            </div>
          </div>

          {/* 개인정보 동의 */}
          <div className="space-y-3 p-4 bg-surface-container rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreePrivacy"
                checked={formData.agreePrivacy}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, agreePrivacy: checked as boolean }))
                }
              />
              <Label htmlFor="agreePrivacy" className="text-sm">
                개인정보 수집 및 이용에 동의합니다
              </Label>
            </div>
            <p className="text-xs text-on-surface-variant pl-6">
              수집된 정보는 견적 제공을 위해서만 사용되며, 완료 후 안전하게 삭제됩니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              등록
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}