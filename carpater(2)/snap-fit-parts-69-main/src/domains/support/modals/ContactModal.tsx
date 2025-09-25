import { useState } from "react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contactCategories = [
  { value: "일반문의", label: "일반문의" },
  { value: "신고", label: "신고하기" },
  { value: "제안", label: "서비스 개선 제안" },
  { value: "버그신고", label: "버그 신고" },
  { value: "기타", label: "기타" }
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
    email: "",
    phone: ""
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
    if (!formData.category) {
      toast({ title: "문의 유형을 선택해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.title.trim()) {
      toast({ title: "제목을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.content.trim()) {
      toast({ title: "문의 내용을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "이메일을 입력해주세요", variant: "destructive" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "올바른 이메일 형식을 입력해주세요", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // API 연결: 1:1 문의 등록
      // POST /api/support/contacts
      const contactData = {
        category: formData.category,
        title: formData.title.trim(),
        content: formData.content.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };

      // 임시: 성공 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "문의가 등록되었습니다",
        description: "빠른 시간 내에 답변드리겠습니다."
      });

      handleClose();
    } catch (error) {
      console.error("문의 등록 실패:", error);
      toast({
        title: "문의 등록에 실패했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      category: "",
      title: "",
      content: "",
      email: "",
      phone: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BaseModal 
      open={isOpen}
      onClose={handleClose}
      title="1:1 문의하기"
      description="궁금한 점이나 문제가 있으시면 언제든 문의해주세요"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-category">문의 유형 *</Label>
          <Select onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="문의 유형을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {contactCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contact-title">제목 *</Label>
          <Input
            id="contact-title"
            placeholder="문의 제목을 입력하세요"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="contact-content">문의 내용 *</Label>
          <Textarea
            id="contact-content"
            placeholder="문의 내용을 자세히 작성해주세요..."
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-email">이메일 *</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="답변받을 이메일"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="contact-phone">연락처</Label>
            <Input
              id="contact-phone"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="bg-surface p-3 rounded-lg">
          <p className="text-sm text-on-surface-variant">
            💡 <strong>빠른 답변을 위한 팁</strong>
          </p>
          <ul className="text-xs text-on-surface-variant mt-1 space-y-1">
            <li>• 문제 상황을 구체적으로 설명해주세요</li>
            <li>• 오류 메시지가 있다면 정확히 기재해주세요</li>
            <li>• 스크린샷이 있으면 이메일로 첨부해주세요</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
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
            {isSubmitting ? "등록 중..." : "문의하기"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}