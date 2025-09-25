import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    "서비스를 더 이상 사용하지 않음",
    "개인정보 보호 우려",
    "다른 서비스로 이전",
    "기능이 부족함",
    "사용이 어려움",
    "기타"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmText !== "회원탈퇴") {
      alert("'회원탈퇴'를 정확히 입력해주세요.");
      return;
    }

    if (!agreedToTerms) {
      alert("탈퇴 안내사항에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API 연결: 회원 탈퇴
      // DELETE /api/users/account
      console.log("회원 탈퇴 요청:", { reason, details });

      // 임시 처리
      onConfirm();
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            회원탈퇴
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 경고 메시지 */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h3 className="font-semibold text-destructive mb-2">⚠️ 주의사항</h3>
            <ul className="text-sm text-destructive space-y-1">
              <li>• 회원탈퇴 시 모든 데이터가 삭제됩니다</li>
              <li>• 작성한 리뷰, 견적 요청 등이 모두 사라집니다</li>
              <li>• 탈퇴 후 동일한 이메일로 재가입이 제한될 수 있습니다</li>
              <li>• 진행 중인 거래가 있다면 완료 후 탈퇴하세요</li>
            </ul>
          </div>

          {/* 탈퇴 사유 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">탈퇴 사유를 선택해주세요</Label>
            <div className="space-y-2">
              {reasons.map((reasonOption) => (
                <div key={reasonOption} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={reasonOption}
                    name="reason"
                    value={reasonOption}
                    checked={reason === reasonOption}
                    onChange={(e) => setReason(e.target.value)}
                    className="rounded"
                  />
                  <Label htmlFor={reasonOption} className="cursor-pointer text-sm">
                    {reasonOption}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 상세 사유 */}
          <div className="space-y-2">
            <Label htmlFor="details">상세 사유 (선택사항)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="서비스 개선을 위한 의견을 남겨주세요"
              rows={3}
            />
          </div>

          {/* 확인 입력 */}
          <div className="space-y-2">
            <Label htmlFor="confirmText">
              탈퇴를 확인하려면 <span className="font-bold text-destructive">'회원탈퇴'</span>를 입력하세요
            </Label>
            <Input
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="회원탈퇴"
              required
            />
          </div>

          {/* 동의 체크박스 */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreedToTerms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <Label htmlFor="agreedToTerms" className="text-sm cursor-pointer">
              위 안내사항을 모두 확인했으며, 회원탈퇴에 동의합니다.
            </Label>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "탈퇴 처리 중..." : "탈퇴하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}