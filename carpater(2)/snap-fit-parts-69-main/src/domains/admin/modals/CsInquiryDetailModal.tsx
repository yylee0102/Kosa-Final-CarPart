/**
 * 1:1 문의 상세 및 답변 모달
 * - 선택된 문의의 상세 내용 표시
 * - 관리자 답변 작성 및 저장/수정
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import adminApiService, { CsInquiryResDTO } from "@/services/admin.api";

interface CsInquiryDetailModalProps {
  open: boolean;
  onClose: () => void;
  inquiryId: number | null;
  onInquiryUpdate: () => void;
}

export default function CsInquiryDetailModal({ open, onClose, inquiryId, onInquiryUpdate }: CsInquiryDetailModalProps) {
  const [inquiry, setInquiry] = useState<CsInquiryResDTO | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // inquiryId가 있고 모달이 열릴 때만 데이터를 불러옵니다.
    // ※ 현재 API 구조상 전체 목록을 다시 불러와 필터링합니다.
    //   만약 단일 문의 조회 API가 있다면 그것을 사용하는 것이 더 효율적입니다.
    if (inquiryId && open) {
      fetchInquiryDetail(inquiryId);
    }
  }, [inquiryId, open]);

  const fetchInquiryDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const inquiries = await adminApiService.getCsInquiries();
      const targetInquiry = inquiries.find(item => item.inquiryId === id);
      if (targetInquiry) {
        setInquiry(targetInquiry);
        setAnswerContent(targetInquiry.answerContent || "");
      }
    } catch (error) {
      toast({ title: "오류", description: "문의 내용을 불러오는 데 실패했습니다.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 답변 저장
   */
  const handleSaveAnswer = async () => {
    if (!inquiry || !answerContent.trim()) {
      toast({ title: "입력 오류", description: "답변 내용을 입력해주세요.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await adminApiService.answerInquiry(inquiry.inquiryId, answerContent.trim());
      toast({ title: "답변 저장 완료", description: "답변이 성공적으로 등록되었습니다." });
      onInquiryUpdate(); // 부모 컴포넌트의 목록 새로고침
      onClose();         // 모달 닫기
    } catch (error) {
      toast({ title: "저장 실패", description: "답변 저장 중 오류가 발생했습니다.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>1:1 문의 상세 및 답변</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : inquiry ? (
          <div className="space-y-4">
            <div>
              <Label>문의 제목</Label>
              <p className="font-semibold">{inquiry.title}</p>
            </div>
            <div>
              <Label>작성자 / 작성일</Label>
              <p className="text-sm text-muted-foreground">{inquiry.userName} / {formatDate(inquiry.createdAt)}</p>
            </div>
            <div>
              <Label>문의 내용</Label>
              <div className="p-3 bg-muted rounded-md border text-sm whitespace-pre-wrap">{inquiry.questionContent}</div>
            </div>
            <div>
              <Label htmlFor="answerContent">답변 작성</Label>
              <Textarea
                id="answerContent"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="답변을 입력하세요..."
                rows={6}
                disabled={isSaving}
              />
            </div>
          </div>
        ) : (
          <div>문의 내용을 불러오지 못했습니다.</div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>취소</Button>
          <Button onClick={handleSaveAnswer} disabled={isLoading || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {inquiry?.status === 'ANSWERED' ? '답변 수정' : '답변 등록'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}