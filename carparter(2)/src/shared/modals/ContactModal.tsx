/**
 * 사용자 문의 작성 모달
 * 
 * 이 모달의 역할:
 * - 사용자가 1:1 문의를 작성할 수 있는 인터페이스
 * - 문의 카테고리 선택 및 상세 내용 작성
 * - 문의 제출 후 관리자 답변 대기
 * 
 * 왜 필요한가:
 * - 사용자 지원 서비스의 핵심 기능
 * - 사용자 만족도 향상을 위한 소통 창구
 * - 체계적인 문의 관리 시스템 구축
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const inquiryCategories = [
    { value: "account", label: "계정 관련" },
    { value: "payment", label: "결제 문의" },
    { value: "estimate", label: "견적 관련" },
    { value: "center", label: "카센터 문의" },
    { value: "technical", label: "기술적 문제" },
    { value: "other", label: "기타" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.category) {
      toast({
        title: "카테고리 선택 필요",
        description: "문의 카테고리를 선택해주세요.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.title.trim()) {
      toast({
        title: "제목 필요",
        description: "문의 제목을 입력해주세요.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: "내용 필요",
        description: "문의 내용을 입력해주세요.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "이메일 필요",
        description: "답변받을 이메일을 입력해주세요.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: 실제 API 연결 시 구현
      // await contactApiService.submitInquiry(formData);
      
      // 개발용 임시 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "문의 접수 완료",
        description: "문의가 성공적으로 접수되었습니다. 빠른 시간 내에 답변드리겠습니다."
      });
      
      handleClose();
    } catch (error) {
      console.error("문의 제출 실패:", error);
      toast({
        title: "문의 접수 실패",
        description: "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
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
      email: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            1:1 문의하기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 안내 메시지 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>문의 안내:</strong> 작성해주신 문의사항은 관리자가 검토 후 이메일로 답변드립니다. 
              평균 답변 시간은 1-2 영업일입니다.
            </p>
          </div>

          {/* 문의 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="category">문의 카테고리 *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="문의 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquiryCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="email">답변받을 이메일 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="답변을 받을 이메일 주소를 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="문의 제목을 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">문의 내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="문의하실 내용을 자세히 작성해주세요"
              rows={8}
              disabled={isSubmitting}
            />
          </div>

          {/* 개인정보 동의 */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <p><strong>개인정보 수집 및 이용 동의</strong></p>
            <p className="mt-1">
              문의 처리를 위해 입력하신 개인정보(이메일, 문의내용)를 수집하며, 
              문의 처리 완료 후 1년간 보관 후 자동 삭제됩니다.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.category || !formData.title.trim() || !formData.content.trim() || !formData.email.trim()}
            >
              {isSubmitting ? (
                "문의 접수 중..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  문의 접수
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}