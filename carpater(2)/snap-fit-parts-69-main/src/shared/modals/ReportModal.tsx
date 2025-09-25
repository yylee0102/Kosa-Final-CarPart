import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "part" | "review" | "user" | "center";
  targetId: string;
}

const reportReasons = {
  part: [
    { value: "fake", label: "허위 상품 정보" },
    { value: "scam", label: "사기 의심" },
    { value: "duplicate", label: "중복 게시물" },
    { value: "inappropriate", label: "부적절한 내용" },
    { value: "spam", label: "스팸/광고" },
    { value: "other", label: "기타" }
  ],
  review: [
    { value: "fake", label: "허위 리뷰" },
    { value: "inappropriate", label: "부적절한 내용" },
    { value: "personal", label: "개인정보 노출" },
    { value: "hate", label: "혐오 발언" },
    { value: "spam", label: "스팸/광고" },
    { value: "other", label: "기타" }
  ],
  user: [
    { value: "harassment", label: "괴롭힘/협박" },
    { value: "impersonation", label: "사칭/도용" },
    { value: "inappropriate", label: "부적절한 행동" },
    { value: "scam", label: "사기 행위" },
    { value: "spam", label: "스팸/광고" },
    { value: "other", label: "기타" }
  ],
  center: [
    { value: "service", label: "서비스 불만" },
    { value: "false_info", label: "허위 정보" },
    { value: "overcharge", label: "과도한 요금" },
    { value: "unprofessional", label: "비전문적 행동" },
    { value: "other", label: "기타" }
  ]
};

const reportTitles = {
  part: "상품 신고",
  review: "리뷰 신고", 
  user: "사용자 신고",
  center: "카센터 신고"
};

export default function ReportModal({ isOpen, onClose, targetType, targetId }: ReportModalProps) {
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

    setIsSubmitting(true);

    try {
      // API 연결: 신고 제출
      // POST /api/reports
      const reportData = {
        targetType,
        targetId,
        reason: selectedReason,
        details,
        reportedAt: new Date().toISOString()
      };

      console.log("신고 제출:", reportData);

      // 임시 처리
      toast({
        title: "신고가 접수되었습니다",
        description: "검토 후 적절한 조치를 취하겠습니다."
      });

      onClose();
      setSelectedReason("");
      setDetails("");
    } catch (error) {
      console.error("신고 제출 실패:", error);
      toast({
        title: "신고 제출에 실패했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = reportReasons[targetType] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{reportTitles[targetType]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">신고 사유를 선택해주세요</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">상세 내용 (선택사항)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="추가적인 신고 사유나 상황을 설명해주세요"
              rows={4}
            />
          </div>

          <div className="text-sm text-on-surface-variant bg-surface-container p-3 rounded-lg">
            <p className="font-medium mb-1">신고 처리 안내</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>신고 내용은 24시간 내에 검토됩니다</li>
              <li>허위 신고 시 제재를 받을 수 있습니다</li>
              <li>처리 결과는 개별 통지됩니다</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "신고 중..." : "신고하기"}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}