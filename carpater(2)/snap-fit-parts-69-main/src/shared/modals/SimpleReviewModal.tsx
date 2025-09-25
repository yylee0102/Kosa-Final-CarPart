// 간단한 리뷰 작성 모달 (임시)
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface SimpleReviewModalProps {
  open: boolean;
  onClose: () => void;
  centerName?: string;
  serviceInfo?: string;
}

export default function SimpleReviewModal({ 
  open, 
  onClose, 
  centerName = "강남 오토 서비스",
  serviceInfo = "범퍼 수리" 
}: SimpleReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    
    if (reviewText.trim().length < 10) {
      alert("10자 이상 리뷰를 작성해주세요.");
      return;
    }

    // TODO: 리뷰 제출 API 호출
    console.log("리뷰 제출:", { rating, reviewText, centerName, serviceInfo });
    alert("리뷰가 등록되었습니다!");
    
    // 초기화
    setRating(0);
    setReviewText("");
    onClose();
  };

  const getRatingText = (rating: number) => {
    switch(rating) {
      case 1: return "매우 불만족";
      case 2: return "불만족";
      case 3: return "보통";
      case 4: return "만족";
      case 5: return "매우 만족";
      default: return "별점을 선택해주세요";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 서비스 정보 */}
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold">{centerName}</h3>
            <p className="text-sm text-muted-foreground">{serviceInfo}</p>
          </div>

          {/* 별점 선택 */}
          <div className="text-center">
            <Label className="text-base font-medium">서비스 만족도</Label>
            <div className="flex justify-center gap-1 mt-3 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {getRatingText(hoveredRating || rating)}
            </p>
          </div>

          {/* 리뷰 내용 */}
          <div>
            <Label htmlFor="reviewText">리뷰 내용</Label>
            <Textarea
              id="reviewText"
              placeholder="서비스에 대한 솔직한 후기를 작성해주세요. (최소 10자)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="mt-2"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>최소 10자 이상</span>
              <span>{reviewText.length}/500</span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={rating === 0 || reviewText.trim().length < 10}
              className="flex-1"
            >
              리뷰 등록
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}