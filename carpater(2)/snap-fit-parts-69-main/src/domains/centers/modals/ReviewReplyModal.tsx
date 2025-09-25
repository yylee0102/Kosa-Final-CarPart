/**
 * 리뷰 답글 작성 모달
 * 
 * 기능:
 * - 카센터에서 고객 리뷰에 답글 작성
 * - 답글 수정
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewReplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (replyData: any) => void;
  review: {
    reviewId: number;
    writerName: string;
    content: string;
    rating: number;
    createdAt: string;
    reply?: string;
  } | null;
}

export function ReviewReplyModal({ 
  open, 
  onClose, 
  onSubmit, 
  review 
}: ReviewReplyModalProps) {
  const [replyContent, setReplyContent] = useState(review?.reply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!replyContent.trim()) {
      toast.error("답글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        reviewId: review?.reviewId,
        reply: replyContent
      });
      
      toast.success("답글이 성공적으로 등록되었습니다.");
      onClose();
    } catch (error) {
      toast.error("답글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>리뷰 답글 작성</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 원본 리뷰 */}
          {review && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{review.writerName}</span>
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-sm">{review.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* 답글 작성 */}
          <div className="space-y-2">
            <Label htmlFor="reply">답글 내용</Label>
            <Textarea
              id="reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="고객에게 정중하고 성의있는 답글을 작성해주세요."
              rows={4}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">
              {replyContent.length}/300자
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "등록 중..." : review?.reply ? "답글 수정" : "답글 등록"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}