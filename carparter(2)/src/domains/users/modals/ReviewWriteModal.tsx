import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import UserApiService,{ ReviewReqDTO, ReviewResDTO } from '@/services/user.api'; 

interface ReviewWriteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewReqDTO) => Promise<void>; 
  centerName: string;
  centerId: string;
  repairId?: number; // 수리 내역과 연결된 리뷰인 경우에만 포함
  existingReview?: ReviewResDTO | null; // ✅ 수정할 리뷰 데이터를 받는 prop 추가
}

export function ReviewWriteModal({ 
  open, 
  onClose, 
  onSubmit, 
  centerName,
  centerId,
  repairId,
  existingReview
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setContent(existingReview.content);
    } else {
      // '생성 모드'일 때는 폼을 비웁니다.
      setRating(0);
      setContent("");
    }
  }, [existingReview, open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("리뷰 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    
      const reviewPayload: ReviewReqDTO = {
        centerId: centerId,
        rating: rating,
        content: content,
        repairId: existingReview ? undefined : repairId, // 수정 시에는 repairId 불필요
      };

     try {
      if (existingReview) {
        // ✅ 수정 모드일 경우 updateReview API 호출
        await UserApiService.updateReview(existingReview.reviewId, reviewPayload);
        toast.success("리뷰가 성공적으로 수정되었습니다.");
      } else {
        // ✅ 생성 모드일 경우 createReview API 호출
        await UserApiService.createReview(reviewPayload);
        toast.success("리뷰가 성공적으로 등록되었습니다.");
      }
      onClose();
      // TODO: 부모 컴포넌트의 목록 새로고침 함수 호출

    } catch (error) {
      toast.error(existingReview ? "리뷰 수정에 실패했습니다." : "리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-8 w-8 cursor-pointer transition-colors ${
          i < rating 
            ? 'text-yellow-500 fill-current' 
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {centerName}에서의 경험은 어떠셨나요?
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>별점 평가</Label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
            <p className="text-sm text-muted-foreground">
              별을 클릭하여 평점을 선택하세요 (현재: {rating}점)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">리뷰 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="서비스 경험을 자세히 알려주세요."
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/500자
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "등록 중..." : "리뷰 등록"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}