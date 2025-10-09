import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, MessageCircle, Mail, Heart, Star, AlertTriangle } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationSettings {
  chat: boolean;
  estimate: boolean;
  review: boolean;
  like: boolean;
  system: boolean;
  marketing: boolean;
  email: boolean;
  push: boolean;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    chat: true,
    estimate: true,
    review: true,
    like: false,
    system: true,
    marketing: false,
    email: true,
    push: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // API 연결: 알림 설정 저장
      // PUT /api/users/notification-settings
      console.log("알림 설정 저장:", settings);

      // 임시 처리
      alert("알림 설정이 저장되었습니다.");
      onClose();
    } catch (error) {
      console.error("알림 설정 저장 실패:", error);
      alert("설정 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림 설정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 활동 알림 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-on-surface">활동 알림</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">채팅 메시지</Label>
                    <p className="text-sm text-on-surface-variant">새로운 채팅 메시지 알림</p>
                  </div>
                </div>
                <Switch
                  checked={settings.chat}
                  onCheckedChange={(checked) => handleSettingChange("chat", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">견적서 알림</Label>
                    <p className="text-sm text-on-surface-variant">견적서 도착 및 상태 변경</p>
                  </div>
                </div>
                <Switch
                  checked={settings.estimate}
                  onCheckedChange={(checked) => handleSettingChange("estimate", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">리뷰 알림</Label>
                    <p className="text-sm text-on-surface-variant">새로운 리뷰 및 댓글</p>
                  </div>
                </div>
                <Switch
                  checked={settings.review}
                  onCheckedChange={(checked) => handleSettingChange("review", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">찜하기 알림</Label>
                    <p className="text-sm text-on-surface-variant">찜한 상품 가격 변동</p>
                  </div>
                </div>
                <Switch
                  checked={settings.like}
                  onCheckedChange={(checked) => handleSettingChange("like", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 시스템 알림 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-on-surface">시스템 알림</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">시스템 공지</Label>
                    <p className="text-sm text-on-surface-variant">서비스 업데이트 및 공지사항</p>
                  </div>
                </div>
                <Switch
                  checked={settings.system}
                  onCheckedChange={(checked) => handleSettingChange("system", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">마케팅 정보</Label>
                    <p className="text-sm text-on-surface-variant">이벤트 및 혜택 정보</p>
                  </div>
                </div>
                <Switch
                  checked={settings.marketing}
                  onCheckedChange={(checked) => handleSettingChange("marketing", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 수신 방법 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-on-surface">수신 방법</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">이메일 알림</Label>
                    <p className="text-sm text-on-surface-variant">이메일로 알림 받기</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email}
                  onCheckedChange={(checked) => handleSettingChange("email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="font-medium">푸시 알림</Label>
                    <p className="text-sm text-on-surface-variant">브라우저 푸시 알림</p>
                  </div>
                </div>
                <Switch
                  checked={settings.push}
                  onCheckedChange={(checked) => handleSettingChange("push", checked)}
                />
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-surface-container p-3 rounded-lg text-sm">
            <p className="text-on-surface-variant">
              💡 중요한 알림(계정 보안, 거래 관련)은 설정과 관계없이 발송됩니다.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "저장"}
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