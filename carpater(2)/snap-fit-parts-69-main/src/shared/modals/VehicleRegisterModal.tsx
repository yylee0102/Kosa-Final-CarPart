import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Plus, X } from "lucide-react";

interface VehicleRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface VehicleData {
  year: string;
  make: string;
  model: string;
  detailModel: string;
  partLocation: string;
  price: string;
  description: string;
}

export default function VehicleRegisterModal({ open, onClose, onComplete }: VehicleRegisterModalProps) {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    year: "",
    make: "",
    model: "",
    detailModel: "",
    partLocation: "",
    price: "",
    description: ""
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  const carMakes = [
    "현대", "기아", "쌍용", "르노삼성", "한국GM", "BMW", "벤츠", "아우디", 
    "폭스바겐", "볼보", "토요타", "혼다", "닛산", "마쓰다", "렉서스", "인피니티"
  ];

  const handleInputChange = (field: keyof VehicleData, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleData.year || !vehicleData.make || !vehicleData.model || !vehicleData.detailModel) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    try {
      // API 연결: 차량 등록
      // POST /api/users/vehicles
      console.log("차량 등록 요청:", vehicleData);
      
      // 임시 처리
      alert("차량이 등록되었습니다!");
      onComplete();
    } catch (error) {
      console.error("차량 등록 실패:", error);
      alert("차량 등록에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            차량 부품 등록
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-on-surface mb-3">기본 정보</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">연식 *</Label>
                  <Select value={vehicleData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="연식 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="make">제조사 *</Label>
                  <Select value={vehicleData.make} onValueChange={(value) => handleInputChange("make", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="제조사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map(make => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">차종 *</Label>
                <Input
                  id="model"
                  placeholder="예: 아반떼, 쏘나타, 그랜저 등"
                  value={vehicleData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailModel">부품명 *</Label>
                <Input
                  id="detailModel"
                  placeholder="예: 헤드라이트, 범퍼, 사이드미러 등"
                  value={vehicleData.detailModel}
                  onChange={(e) => handleInputChange("detailModel", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partLocation">부품 위치</Label>
                <Input
                  id="partLocation"
                  placeholder="예: 운전석, 조수석, 앞/뒤 등"
                  value={vehicleData.partLocation}
                  onChange={(e) => handleInputChange("partLocation", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 가격 및 상세 정보 */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-on-surface mb-3">가격 및 상세정보</h3>
              
              <div className="space-y-2">
                <Label htmlFor="price">가격</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={vehicleData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                    원
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">상품설명</Label>
                <textarea
                  id="description"
                  className="w-full min-h-24 p-3 border border-outline rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="부품의 상태, 특이사항 등을 자세히 설명해주세요"
                  value={vehicleData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 이용약관 동의 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" required className="rounded" />
                <label className="text-sm text-on-surface">
                  이용약관 및 개인정보처리방침에 동의합니다.
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
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