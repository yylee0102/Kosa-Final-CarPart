import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "center" | "seller";
  targetId: string;
  targetName: string;
  initialReview?: {
    id: string;
    rating: number;
    content: string;
  };
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  targetType, 
  targetId, 
  targetName,
  initialReview 
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [content, setContent] = useState(initialReview?.content || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!initialReview;

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    if (content.trim().length < 10) {
      alert("리뷰 내용을 10자 이상 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        targetType,
        targetId,
        rating,
        content: content.trim(),
        createdAt: new Date().toISOString()
      };

      if (isEdit) {
        // API 연결: 리뷰 수정
        // PUT /api/reviews/{reviewId}
        console.log("리뷰 수정:", { ...reviewData, reviewId: initialReview.id });
      } else {
        // API 연결: 리뷰 작성
        // POST /api/reviews
        console.log("리뷰 작성:", reviewData);
      }

      // 임시 처리
      alert(isEdit ? "리뷰가 수정되었습니다." : "리뷰가 작성되었습니다.");
      onClose();
      
      // 폼 초기화 (새 리뷰 작성인 경우만)
      if (!isEdit) {
        setRating(0);
        setContent("");
      }
    } catch (error) {
      console.error("리뷰 처리 실패:", error);
      alert(isEdit ? "리뷰 수정에 실패했습니다." : "리뷰 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingTexts = [
    "",
    "매우 불만족",
    "불만족", 
    "보통",
    "만족",
    "매우 만족"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "리뷰 수정" : "리뷰 작성"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 대상 정보 */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-on-surface">{targetName}</h3>
            <p className="text-sm text-on-surface-variant">
              {targetType === "center" ? "카센터" : "판매자"}에 대한 리뷰를 작성해주세요
            </p>
          </div>

          {/* 별점 선택 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">별점을 선택해주세요</Label>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform hover:scale-110"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-sm text-on-surface-variant">
                  {ratingTexts[hoveredRating || rating]}
                </p>
              )}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">리뷰 내용 *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                targetType === "center" 
                  ? "서비스 이용 경험을 자세히 알려주세요. (최소 10자)" 
                  : "거래 경험을 자세히 알려주세요. (최소 10자)"
              }
              rows={4}
              required
              minLength={10}
            />
            <p className="text-sm text-on-surface-variant">
              {content.length}/500자 (최소 10자)
            </p>
          </div>

          {/* 리뷰 작성 가이드 */}
          <div className="bg-surface-container p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">💡 좋은 리뷰 작성 팁</p>
            <ul className="space-y-1 text-on-surface-variant">
              <li>• 구체적인 경험을 상세히 작성해주세요</li>
              <li>• 다른 사용자에게 도움이 되는 정보를 포함해주세요</li>
              <li>• 욕설이나 비방은 삼가해주세요</li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting 
                ? (isEdit ? "수정 중..." : "작성 중...") 
                : (isEdit ? "수정" : "작성")
              }
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}