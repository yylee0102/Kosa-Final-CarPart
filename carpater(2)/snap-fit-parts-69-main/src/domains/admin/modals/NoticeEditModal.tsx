import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// 부모 컴포넌트로부터 받을 데이터의 타입을 정의합니다.
// (백엔드 DTO와 필드가 다르다면 여기에 맞게 조정 가능)
interface Notice {
  announcementId: number;
  title: string;
  content: string;
}

interface NoticeEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (noticeData: any) => Promise<void>; // Promise를 반환하도록 하여 비동기 처리
  notice: Notice | null;
}

export function NoticeEditModal({ open, onClose, onSubmit, notice }: NoticeEditModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // 모달이 열리거나 대상 공지(notice)가 바뀔 때마다 내부 상태를 초기화합니다.
  useEffect(() => {
    if (open) {
      setTitle(notice?.title || "");
      setContent(notice?.content || "");
    }
  }, [notice, open]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "입력 오류", description: "제목과 내용을 모두 입력해주세요.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // 부모로부터 받은 onSubmit 함수를 호출합니다.
      await onSubmit({
        noticeId: notice?.announcementId,
        title,
        content,
      });
      
      toast({
        title: "저장 완료",
        description: `공지사항이 성공적으로 ${notice ? '수정' : '등록'}되었습니다.`
      });
      onClose(); // 성공 시 모달 닫기
    } catch (error) {
      toast({
        title: "저장 실패",
        description: `공지사항 ${notice ? '수정' : '등록'} 중 오류가 발생했습니다.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {notice ? '공지사항 수정' : '새 공지사항 작성'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지사항 내용을 입력하세요"
              rows={10}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "저장 중..." : (notice ? "수정 완료" : "등록")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}