import { useState } from "react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReviewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string | null;
}

const reportReasons = [
  { value: "spam", label: "스팸 또는 광고" },
  { value: "inappropriate", label: "부적절한 내용" },
  { value: "fake", label: "허위 리뷰" },
  { value: "personal", label: "개인정보 노출" },
  { value: "hate", label: "혐오 발언" },
  { value: "other", label: "기타" }
];

export default function ReviewReportModal({ 
  isOpen, 
  onClose, 
  reviewId 
}: ReviewReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: "신고 사유를 선택해주세요",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // API 연결: 리뷰 신고 등록
      // POST /api/reviews/:reviewId/reports
      const reportData = {
        reviewId,
        reason: selectedReason,
        details: details.trim()
      };

      // 임시: 성공 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "신고가 접수되었습니다",
        description: "검토 후 적절한 조치가 취해집니다."
      });

      handleClose();
    } catch (error) {
      console.error("리뷰 신고 실패:", error);
      toast({
        title: "신고 접수에 실패했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDetails("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BaseModal 
      open={isOpen}
      onClose={handleClose}
      title="리뷰 신고하기"
    >
      <div className="space-y-6">
        <p className="text-sm text-on-surface-variant">
          신고 사유를 선택해주세요. 신고된 내용은 검토 후 조치됩니다.
        </p>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium text-on-surface">신고 사유</Label>
            <RadioGroup 
              value={selectedReason} 
              onValueChange={setSelectedReason}
              className="mt-2"
            >
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="text-on-surface">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="report-details" className="text-base font-medium text-on-surface">
              상세 내용 (선택사항)
            </Label>
            <Textarea
              id="report-details"
              placeholder="신고 사유에 대한 추가 설명을 입력해주세요..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-2"
              rows={3}
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
            {isSubmitting ? "신고 중..." : "신고하기"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}