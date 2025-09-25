/**
 * 공지사항 작성/수정 모달
 * 
 * 이 모달의 역할:
 * - 새로운 공지사항 작성 기능
 * - 기존 공지사항 수정 기능
 * - 공지사항 우선순위 설정
 * 
 * 왜 필요한가:
 * - 사용자에게 중요한 정보 전달
 * - 서비스 업데이트나 공지사항 효율적 관리
 * - 일관된 공지사항 작성 인터페이스 제공
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Edit } from "lucide-react";
import adminApiService, { AnnouncementResDTO, AnnouncementReqDTO } from "@/services/admin.api";

interface AnnouncementEditModalProps {
  open: boolean;
  onClose: () => void;
  announcementId?: number;
  onAnnouncementUpdate: () => void;
}

export default function AnnouncementEditModal({ 
  open, 
  onClose, 
  announcementId,
  onAnnouncementUpdate 
}: AnnouncementEditModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const isEditMode = !!announcementId;

  useEffect(() => {
    if (open) {
      if (isEditMode && announcementId) {
        fetchAnnouncementDetail();
      } else {
        // 새 공지사항 작성 모드
        setFormData({
          title: "",
          content: "",
          priority: "normal"
        });
      }
    }
  }, [open, isEditMode, announcementId]);

  const fetchAnnouncementDetail = async () => {
    if (!announcementId) return;
    
    setIsLoading(true);
    try {
      // TODO: 실제 API 연결 시 사용
      // const data = await adminApiService.getAnnouncement(announcementId);
      // setFormData({
      //   title: data.title,
      //   content: data.content,
      //   priority: data.priority || "normal"
      // });
      
      // 개발용 임시 데이터
      const tempData = {
        title: "서버 업데이트 안내",
        content: "안정적인 서비스 제공을 위해 서버 업데이트를 진행합니다.\n\n업데이트 일시: 2025년 9월 10일 새벽 2시~4시\n영향: 일시적인 서비스 중단 (약 2시간)\n\n이용에 불편을 드려 죄송합니다.",
        priority: "high"
      };
      setFormData(tempData);
    } catch (error) {
      console.error("공지사항 상세 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "공지사항 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "제목 필요",
        description: "공지사항 제목을 입력해주세요.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.content.trim()) {
      toast({
        title: "내용 필요",
        description: "공지사항 내용을 입력해주세요.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (isEditMode && announcementId) {
        // 수정 모드
        await adminApiService.updateAnnouncement(announcementId, {
        title: formData.title,
        content: formData.content,
        });
        
        toast({
          title: "수정 완료",
          description: "공지사항이 성공적으로 수정되었습니다."
        });
      } else {
        // 신규 작성 모드
        await adminApiService.createAnnouncement({
          title: formData.title,
          content: formData.content
        });
        
        toast({
          title: "작성 완료",
          description: "새 공지사항이 성공적으로 작성되었습니다."
        });
      }
      
      onAnnouncementUpdate();
      onClose();
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
      toast({
        title: "저장 실패",
        description: "공지사항 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      priority: "normal"
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {isEditMode ? "공지사항 수정" : "새 공지사항 작성"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              disabled={isLoading || isSaving}
            />
          </div>

          {/* 우선순위 */}
          <div className="space-y-2">
            <Label htmlFor="priority">우선순위</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => handleInputChange("priority", value)}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">일반</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="high">중요</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="공지사항 내용을 입력하세요"
              rows={10}
              disabled={isLoading || isSaving}
            />
          </div>

          {/* 작성 가이드 */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <p><strong>작성 가이드:</strong></p>
            <ul className="mt-1 space-y-1">
              <li>• 명확하고 간결한 제목을 사용하세요</li>
              <li>• 사용자가 이해하기 쉬운 언어로 작성하세요</li>
              <li>• 중요한 정보는 우선순위를 '중요'로 설정하세요</li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading || isSaving}
            >
              취소
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading || isSaving || !formData.title.trim() || !formData.content.trim()}
            >
              {isSaving ? (
                "저장 중..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "수정 완료" : "작성 완료"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}