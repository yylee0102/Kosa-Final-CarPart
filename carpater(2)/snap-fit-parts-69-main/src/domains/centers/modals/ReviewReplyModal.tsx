/**
 * 리뷰 답글 작성 모달
 * * 기능:
 * - 카센터에서 고객 리뷰에 답글 작성
 * - 답글 수정
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Review } from "@/services/carCenter.api"; // Review 타입을 import

interface ReviewReplyModalProps {
  open: boolean;
  onClose: () => void;
  // ✅ [수정] API의 ReviewReplyReqDTO에 맞게 타입을 명확히 합니다.
  onSubmit: (replyData: { reviewId: number; content: string }) => void;
  review: Review | null;
}

export function ReviewReplyModal({ 
  open, 
  onClose, 
  onSubmit, 
  review 
}: ReviewReplyModalProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // review prop이 변경될 때마다 답글 내용을 초기화합니다.
  useEffect(() => {
    setReplyContent(review?.reply || "");
  }, [review]);

  const handleSubmit = async () => {
    if (!review) return;

    if (!replyContent.trim()) {
      toast.error("답글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // ✅ [수정] API DTO에 맞는 형식(`content`)으로 데이터를 전달합니다.
      await onSubmit({
        reviewId: review.reviewId,
        content: replyContent
      });
      
      // 성공/실패 토스트는 부모 컴포넌트(CenterMyPage)에서 처리하므로 여기서는 제거합니다.
      onClose();
    } catch (error) {
      // 에러 처리도 부모 컴포넌트로 위임합니다.
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
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
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