// 휴대폰 번호 인증 모달 (개선된 버전)
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Shield } from "lucide-react";
import authApiService from "@/services/auth.api";

interface PhoneVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  phoneNumber: string;
}

export default function PhoneVerificationModal({ 
  open, 
  onClose, 
  onVerified, 
  phoneNumber 
}: PhoneVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSendCode = async () => {
    if (!phoneNumber) {
      toast({
        title: "오류",
        description: "전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      await authApiService.sendVerificationCode(phoneNumber);
      setCodeSent(true);
      setTimeLeft(180); // 3분
      toast({
        title: "인증코드 발송",
        description: "인증코드가 발송되었습니다."
      });
    } catch (error) {
      console.error("인증코드 발송 실패:", error);
      // 개발용 임시 처리
      setCodeSent(true);
      setTimeLeft(180);
      toast({
        title: "인증코드 발송 (개발용)",
        description: "임시 인증코드: 123456"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "입력 오류",
        description: "6자리 인증코드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const isVerified = await authApiService.verifyPhoneCode(phoneNumber, verificationCode);
      
      if (isVerified) {
        toast({
          title: "인증 완료",
          description: "전화번호 인증이 완료되었습니다."
        });
        onVerified();
        onClose();
      } else {
        toast({
          title: "인증 실패",
          description: "인증코드가 올바르지 않습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("인증 실패:", error);
      // 개발용 임시 처리
      if (verificationCode === "123456") {
        toast({
          title: "인증 완료 (개발용)",
          description: "전화번호 인증이 완료되었습니다."
        });
        onVerified();
        onClose();
      } else {
        toast({
          title: "인증 실패",
          description: "인증코드가 올바르지 않습니다.",
          variant: "destructive"
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            휴대폰 번호 인증
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              휴대폰 번호
            </Label>
            <div className="flex gap-2">
              <Input 
                value={phoneNumber} 
                disabled 
                className="flex-1"
                placeholder="휴대폰 번호"
              />
              <Button 
                variant="outline" 
                onClick={handleSendCode}
                disabled={isSending || timeLeft > 0}
                className="shrink-0"
              >
                {isSending ? "발송중..." : timeLeft > 0 ? formatTime(timeLeft) : "인증코드 발송"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationCode">인증코드</Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="인증코드 6자리 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center tracking-widest text-lg"
            />
            {codeSent && (
              <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                💡 개발용 임시 인증코드: <strong>123456</strong>
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || isVerifying || !codeSent}
              className="flex-1"
            >
              {isVerifying ? "인증 중..." : "인증 확인"}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}