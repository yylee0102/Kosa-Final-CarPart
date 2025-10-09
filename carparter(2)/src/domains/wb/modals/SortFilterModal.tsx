import { useState } from "react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface SortFilterModalProps {
  open: boolean;
  onClose: () => void;
  currentSort: string;
  currentFilters: {
    priceRange: [number, number];
    conditions: string[];
    sellerTypes: string[];
    location: string;
  };
  onApply: (sort: string, filters: any) => void;
}

export default function SortFilterModal({ 
  open, 
  onClose, 
  currentSort, 
  currentFilters, 
  onApply 
}: SortFilterModalProps) {
  const [sort, setSort] = useState(currentSort);
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters.priceRange);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(currentFilters.conditions);
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>(currentFilters.sellerTypes);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "price-low", label: "가격 낮은순" },
    { value: "price-high", label: "가격 높은순" },
    { value: "popular", label: "인기순" },
    { value: "distance", label: "거리순" }
  ];

  const conditions = ["신품", "중고A급", "중고B급", "중고C급"];
  const sellerTypes = ["개인", "업체"];

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition]);
    } else {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    }
  };

  const handleSellerTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedSellerTypes([...selectedSellerTypes, type]);
    } else {
      setSelectedSellerTypes(selectedSellerTypes.filter(t => t !== type));
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${Math.floor(price / 10000)}만원`;
    }
    return `${price.toLocaleString()}원`;
  };

  const handleApply = () => {
    onApply(sort, {
      priceRange,
      conditions: selectedConditions,
      sellerTypes: selectedSellerTypes,
      location: currentFilters.location
    });
    onClose();
  };

  const handleReset = () => {
    setSort("latest");
    setPriceRange([0, 1000000]);
    setSelectedConditions([]);
    setSelectedSellerTypes([]);
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="정렬 및 필터"
      description="원하는 조건으로 부품을 찾아보세요"
      size="md"
    >
      <div className="space-y-6">
        {/* 정렬 옵션 */}
        <div className="space-y-3">
          <h3 className="font-medium text-on-surface">정렬</h3>
          <RadioGroup value={sort} onValueChange={setSort}>
            {sortOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* 가격 범위 */}
        <div className="space-y-4">
          <h3 className="font-medium text-on-surface">가격 범위</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              max={1000000}
              min={0}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-on-surface-variant">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* 상품 상태 */}
        <div className="space-y-3">
          <h3 className="font-medium text-on-surface">상품 상태</h3>
          <div className="space-y-2">
            {conditions.map(condition => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={(checked) => 
                    handleConditionChange(condition, checked as boolean)
                  }
                />
                <Label htmlFor={condition} className="text-sm cursor-pointer">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 판매자 유형 */}
        <div className="space-y-3">
          <h3 className="font-medium text-on-surface">판매자 유형</h3>
          <div className="space-y-2">
            {sellerTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={selectedSellerTypes.includes(type)}
                  onCheckedChange={(checked) => 
                    handleSellerTypeChange(type, checked as boolean)
                  }
                />
                <Label htmlFor={type} className="text-sm cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1"
          >
            초기화
          </Button>
          <Button 
            onClick={handleApply}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            적용하기
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}