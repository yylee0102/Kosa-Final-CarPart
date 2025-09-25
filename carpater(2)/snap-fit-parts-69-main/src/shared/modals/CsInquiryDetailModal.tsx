/**
 * 1:1 문의 상세 및 답변 모달
 * 
 * 이 모달의 역할:
 * - 사용자의 1:1 문의 내용 상세 확인
 * - 관리자 답변 작성 및 수정 기능
 * - 문의 처리 상태 관리
 * 
 * 왜 필요한가:
 * - 고객 지원 서비스의 핵심 기능
 * - 사용자 만족도 향상을 위한 신속한 문의 응답
 * - 체계적인 고객 문의 관리 시스템
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Calendar, User } from "lucide-react";
import adminApiService, { CsInquiryResDTO } from "@/services/admin.api";

interface CsInquiryDetailModalProps {
  open: boolean;
  onClose: () => void;
  inquiryId: number | null;
  onInquiryUpdate: () => void;
}

export default function CsInquiryDetailModal({ 
  open, 
  onClose, 
  inquiryId,
  onInquiryUpdate 
}: CsInquiryDetailModalProps) {
  const [inquiryData, setInquiryData] = useState<CsInquiryResDTO | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && inquiryId) {
      fetchInquiryDetail();
    }
  }, [open, inquiryId]);

  useEffect(() => {
    if (inquiryData?.answerContent) {
      setAnswer(inquiryData.answerContent);
    }
  }, [inquiryData]);

  const fetchInquiryDetail = async () => {
    if (!inquiryId) return;
    
    setIsLoading(true);
    try {
      // TODO: 실제 API 연결 시 사용
      // const data = await adminApiService.getCsInquiry(inquiryId);
      // setInquiryData(data);
      
      // 개발용 임시 데이터
      const tempData: CsInquiryResDTO = {
        inquiryId: inquiryId,
        userId: "user123",
        userName: "홍길동",
        title: "견적 요청 관련 문의",
        questionContent: "안녕하세요. 견적 요청을 했는데 응답이 없어서 문의드립니다. 언제쯤 답변을 받을 수 있을까요?",
        answerContent: inquiryData?.answerContent || "",
        status: 'PENDING',
        createdAt: "2025-09-08T14:30:00",
        answeredAt: undefined
      };
      setInquiryData(tempData);
    } catch (error) {
      console.error("문의 상세 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "문의 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnswer = async () => {
    if (!inquiryId || !inquiryData) return;

    if (!answer.trim()) {
      toast({
        title: "답변 내용 필요",
        description: "답변 내용을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedInquiry: CsInquiryResDTO = {
        ...inquiryData,
        answerContent: answer,
        status: 'ANSWERED',
        answeredAt: new Date().toISOString()
      };

      await adminApiService.answerInquiry(inquiryId, answer);
      
      toast({
        title: "답변 저장 완료",
        description: "고객 문의에 대한 답변이 저장되었습니다."
      });
      
      onInquiryUpdate();
      onClose();
    } catch (error) {
      console.error("답변 저장 실패:", error);
      toast({
        title: "저장 실패",
        description: "답변 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">답변 대기</Badge>;
      case 'ANSWERED':
        return <Badge className="bg-green-100 text-green-800">답변 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleClose = () => {
    setAnswer("");
    onClose();
  };

  if (!inquiryData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            1:1 문의 상세
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 문의 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <User className="h-4 w-4" />
                문의자
              </Label>
              <p className="font-semibold">{inquiryData.userId}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">상태</Label>
              <div>{getStatusBadge(inquiryData.status)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              문의일시
            </Label>
            <p>{inquiryData.createdAt}</p>
          </div>

          {/* 문의 제목 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">제목</Label>
            <p className="text-lg font-semibold">{inquiryData.title}</p>
          </div>

          {/* 문의 내용 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">문의 내용</Label>
            <div className="p-4 bg-muted rounded-lg">
              <p className="whitespace-pre-wrap">{inquiryData.questionContent}</p>
            </div>
          </div>

          {/* 답변 작성 영역 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">관리자 답변</Label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="고객 문의에 대한 답변을 작성해주세요..."
              rows={6}
              disabled={isSaving}
            />
          </div>

          {/* 답변 완료 시 정보 */}
          {inquiryData.status === 'ANSWERED' && inquiryData.answeredAt && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>답변 완료:</strong> {inquiryData.answeredAt}
              </p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              닫기
            </Button>
            <Button 
              onClick={handleSaveAnswer}
              disabled={isSaving || !answer.trim()}
            >
              {isSaving ? (
                "저장 중..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  답변 저장
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}