import { useState } from "react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatKRW } from "@/shared/utils/format";

interface EstimateSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimateId: string;
}

export default function EstimateSendModal({ 
  isOpen, 
  onClose, 
  estimateId 
}: EstimateSendModalProps) {
  const [formData, setFormData] = useState({
    estimatedCost: "",
    workDays: "",
    description: "",
    centerName: "",
    centerPhone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.centerName.trim()) {
      toast({ title: "카센터명을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.estimatedCost.trim()) {
      toast({ title: "견적 금액을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.workDays.trim()) {
      toast({ title: "작업 예상일을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.description.trim()) {
      toast({ title: "작업 내용을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.centerPhone.trim()) {
      toast({ title: "연락처를 입력해주세요", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // API 연결: 견적서 발송
      // POST /api/estimates/:estimateId/responses
      const responseData = {
        estimateId,
        estimatedCost: parseInt(formData.estimatedCost.replace(/[^0-9]/g, '')),
        workDays: parseInt(formData.workDays),
        description: formData.description.trim(),
        centerName: formData.centerName.trim(),
        centerPhone: formData.centerPhone.trim()
      };

      // 임시: 성공 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "견적서가 발송되었습니다",
        description: "고객이 견적을 확인하면 알림으로 안내드리겠습니다."
      });

      handleClose();
    } catch (error) {
      console.error("견적서 발송 실패:", error);
      toast({
        title: "견적서 발송에 실패했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      estimatedCost: "",
      workDays: "",
      description: "",
      centerName: "",
      centerPhone: ""
    });
    onClose();
  };

  // 금액 입력 시 포맷팅
  const handleCostChange = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    const formatted = numbers ? parseInt(numbers).toLocaleString() : '';
    handleInputChange('estimatedCost', formatted);
  };

  if (!isOpen) return null;

  return (
    <BaseModal 
      open={isOpen}
      onClose={handleClose}
      title="견적서 작성하기"
    >
      <div className="space-y-6">
        <p className="text-sm text-on-surface-variant">
          고객에게 보낼 견적 정보를 입력해주세요.
        </p>

        <div className="space-y-4">
          {/* 카센터 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="center-name">카센터명 *</Label>
              <Input
                id="center-name"
                placeholder="카센터명을 입력하세요"
                value={formData.centerName}
                onChange={(e) => handleInputChange("centerName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="center-phone">연락처 *</Label>
              <Input
                id="center-phone"
                placeholder="010-1234-5678"
                value={formData.centerPhone}
                onChange={(e) => handleInputChange("centerPhone", e.target.value)}
              />
            </div>
          </div>

          {/* 견적 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated-cost">견적 금액 *</Label>
              <Input
                id="estimated-cost"
                placeholder="150000"
                value={formData.estimatedCost}
                onChange={(e) => handleCostChange(e.target.value)}
              />
              {formData.estimatedCost && (
                <p className="text-sm text-on-surface-variant mt-1">
                  {formatKRW(parseInt(formData.estimatedCost.replace(/[^0-9]/g, '')) || 0)}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="work-days">작업 예상일 *</Label>
              <Input
                id="work-days"
                placeholder="1"
                type="number"
                value={formData.workDays}
                onChange={(e) => handleInputChange("workDays", e.target.value)}
              />
            </div>
          </div>

          {/* 작업 내용 */}
          <div>
            <Label htmlFor="work-description">작업 내용 *</Label>
            <Textarea
              id="work-description"
              placeholder="수리 방법, 사용 부품, 작업 과정 등을 자세히 설명해주세요..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "발송 중..." : "견적서 발송"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}