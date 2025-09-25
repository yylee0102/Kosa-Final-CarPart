/**
 * 리뷰 작성 모달
 * 
 * 기능:
 * - 견적 완료 후 리뷰 작성
 * - 별점 평가
 * - 사진 첨부
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, Camera, X } from "lucide-react";
import { toast } from "sonner";

interface ReviewWriteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reviewData: any) => void;
  centerName: string;
  estimateId?: number;
}

export function ReviewWriteModal({ 
  open, 
  onClose, 
  onSubmit, 
  centerName,
  estimateId 
}: ReviewWriteModalProps) {
  const [reviewData, setReviewData] = useState({
    centerId: "",
    estimateId: estimateId || 0,
    rating: 0,
    content: "",
    images: [] as File[]
  });
  
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (rating: number) => {
    setReviewData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleContentChange = (content: string) => {
    setReviewData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + reviewData.images.length > 5) {
      toast.error("최대 5장까지 첨부 가능합니다.");
      return;
    }

    // 이미지 파일 추가
    setReviewData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // 미리보기 이미지 생성
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (reviewData.rating === 0) {
      toast.error("별점을 선택해주세요.");
      return;
    }
    
    if (!reviewData.content.trim()) {
      toast.error("리뷰 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // FormData 생성 (이미지 파일 포함)
      const formData = new FormData();
      formData.append('reviewData', JSON.stringify({
        centerId: reviewData.centerId,
        estimateId: reviewData.estimateId,
        rating: reviewData.rating,
        content: reviewData.content
      }));
      
      reviewData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      await onSubmit(formData);
      toast.success("리뷰가 성공적으로 등록되었습니다.");
      
      // 폼 초기화
      setReviewData({
        centerId: "",
        estimateId: estimateId || 0,
        rating: 0,
        content: "",
        images: []
      });
      setPreviewImages([]);
      onClose();
    } catch (error) {
      toast.error("리뷰 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-8 w-8 cursor-pointer transition-colors ${
          i < reviewData.rating 
            ? 'text-yellow-500 fill-current' 
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={() => handleRatingClick(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {centerName}에 대한 리뷰를 작성해주세요
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 별점 평가 */}
          <div className="space-y-2">
            <Label>별점 평가</Label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
            <p className="text-sm text-muted-foreground">
              별을 클릭하여 평점을 선택하세요 (현재: {reviewData.rating}점)
            </p>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">리뷰 내용</Label>
            <Textarea
              id="content"
              value={reviewData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="서비스 경험을 자세히 알려주세요. 다른 고객들에게 도움이 됩니다."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewData.content.length}/500자
            </p>
          </div>

          {/* 사진 첨부 */}
          <div className="space-y-2">
            <Label>사진 첨부 (선택사항)</Label>
            <div className="space-y-2">
              <Label htmlFor="review-images" className="cursor-pointer">
                <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-muted-foreground rounded-md hover:bg-muted/50">
                  <Camera className="h-4 w-4" />
                  사진 추가 ({reviewData.images.length}/5)
                </div>
              </Label>
              <Input
                id="review-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            
            {/* 이미지 미리보기 */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`리뷰 이미지 ${index + 1}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => handleImageRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4">
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
              {isSubmitting ? "등록 중..." : "리뷰 등록"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}