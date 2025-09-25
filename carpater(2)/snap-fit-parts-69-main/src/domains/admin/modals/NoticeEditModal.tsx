/**
 * 공지사항 작성/수정 모달
 * 
 * 기능:
 * - 새 공지사항 작성
 * - 기존 공지사항 수정
 * - 중요도 설정
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface NoticeEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (noticeData: any) => void;
  notice?: {
    noticeId: number;
    title: string;
    content: string;
    category: string;
    isImportant: boolean;
    isActive: boolean;
  } | null;
}

export function NoticeEditModal({ 
  open, 
  onClose, 
  onSubmit, 
  notice 
}: NoticeEditModalProps) {
  const [noticeData, setNoticeData] = useState({
    title: notice?.title || "",
    content: notice?.content || "",
    category: notice?.category || "일반",
    isImportant: notice?.isImportant || false,
    isActive: notice?.isActive !== undefined ? notice.isActive : true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setNoticeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!noticeData.title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    
    if (!noticeData.content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...noticeData,
        noticeId: notice?.noticeId
      });
      
      toast.success(`공지사항이 성공적으로 ${notice ? '수정' : '등록'}되었습니다.`);
      onClose();
    } catch (error) {
      toast.error(`공지사항 ${notice ? '수정' : '등록'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {notice ? '공지사항 수정' : '새 공지사항 작성'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={noticeData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              maxLength={100}
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select 
              value={noticeData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="일반">일반</SelectItem>
                <SelectItem value="서비스">서비스</SelectItem>
                <SelectItem value="업데이트">업데이트</SelectItem>
                <SelectItem value="이벤트">이벤트</SelectItem>
                <SelectItem value="점검">점검</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={noticeData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="공지사항 내용을 입력하세요"
              rows={8}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {noticeData.content.length}/2000자
            </p>
          </div>

          {/* 설정 옵션 */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>중요 공지사항</Label>
                <p className="text-sm text-muted-foreground">
                  상단에 고정되어 표시됩니다
                </p>
              </div>
              <Switch
                checked={noticeData.isImportant}
                onCheckedChange={(checked) => handleInputChange('isImportant', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>게시 상태</Label>
                <p className="text-sm text-muted-foreground">
                  활성화시 사용자에게 공개됩니다
                </p>
              </div>
              <Switch
                checked={noticeData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
            </div>
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
              {isSubmitting ? "저장 중..." : notice ? "수정 완료" : "등록"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}