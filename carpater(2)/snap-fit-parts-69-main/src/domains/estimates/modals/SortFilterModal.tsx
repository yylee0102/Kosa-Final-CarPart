import { useState } from "react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface SortFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

interface FilterOptions {
  sortBy: string;
  sortOrder: "asc" | "desc";
  categories: string[];
  statuses: string[];
  hasImages: boolean;
}

const sortOptions = [
  { value: "createdAt", label: "등록일순" },
  { value: "responseCount", label: "견적 수순" },
  { value: "title", label: "제목순" }
];

const categoryOptions = [
  "엔진 수리", "브레이크 정비", "타이어 교체", "에어컨 수리",
  "전기계통", "차체 수리", "내부 수리", "정기 점검", "기타"
];

const statusOptions = [
  "요청", "견적발송", "확정", "완료", "취소"
];

export default function SortFilterModal({ 
  isOpen, 
  onClose, 
  onApply 
}: SortFilterModalProps) {
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [hasImages, setHasImages] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses(prev => [...prev, status]);
    } else {
      setSelectedStatuses(prev => prev.filter(s => s !== status));
    }
  };

  const handleReset = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setHasImages(false);
  };

  const handleApply = () => {
    onApply({
      sortBy,
      sortOrder,
      categories: selectedCategories,
      statuses: selectedStatuses,
      hasImages
    });
  };

  if (!isOpen) return null;

  return (
    <BaseModal 
      open={isOpen}
      onClose={onClose}
      title="정렬 및 필터"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">

        {/* 정렬 옵션 */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-on-surface">정렬 기준</Label>
          <RadioGroup value={sortBy} onValueChange={setSortBy}>
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-on-surface">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <RadioGroup 
            value={sortOrder} 
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="desc" id="desc" />
              <Label htmlFor="desc" className="text-on-surface">내림차순</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asc" id="asc" />
              <Label htmlFor="asc" className="text-on-surface">오름차순</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* 카테고리 필터 */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-on-surface">카테고리</Label>
          <div className="grid grid-cols-2 gap-2">
            {categoryOptions.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`category-${category}`} 
                  className="text-sm text-on-surface"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 상태 필터 */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-on-surface">상태</Label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => 
                    handleStatusChange(status, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`status-${status}`} 
                  className="text-sm text-on-surface"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 기타 옵션 */}
        <div className="space-y-3">
          <Label className="text-base font-medium text-on-surface">기타 옵션</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-images"
              checked={hasImages}
              onCheckedChange={(checked) => setHasImages(checked as boolean)}
            />
            <Label htmlFor="has-images" className="text-sm text-on-surface">
              사진이 있는 게시글만
            </Label>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            초기화
          </Button>
          <Button onClick={handleApply} className="flex-1">
            적용하기
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}