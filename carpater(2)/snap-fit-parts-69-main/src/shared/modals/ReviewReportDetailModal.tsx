/**
 * 리뷰 신고 상세 모달
 * 
 * 이 모달의 역할:
 * - 신고된 리뷰의 상세 내용 확인
 * - 신고 사유 및 관련 정보 검토
 * - 신고 처리 결정 (승인/반려)
 * 
 * 왜 필요한가:
 * - 부적절한 리뷰 관리를 통한 플랫폼 건전성 유지
 * - 공정한 신고 처리를 위한 상세 검토 시스템
 * - 사용자 간의 분쟁 해결 지원
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, XCircle, Calendar, User, MessageSquare } from "lucide-react";
import adminApiService, { ReviewReportResDTO } from "@/services/admin.api";

interface ReviewReportDetailModalProps {
  open: boolean;
  onClose: () => void;
  reportId: number | null;
  onReportUpdate: () => void;
}

export default function ReviewReportDetailModal({ 
  open, 
  onClose, 
  reportId,
  onReportUpdate 
}: ReviewReportDetailModalProps) {
  const [reportData, setReportData] = useState<ReviewReportResDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open && reportId) {
      fetchReportDetail();
    }
  }, [open, reportId]);

  const fetchReportDetail = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      // TODO: 실제 API 연결 시 사용
      // const data = await adminApiService.getReviewReport(reportId);
      // setReportData(data);
      
      // 개발용 임시 데이터
      const tempData: ReviewReportResDTO = {
        reportId: reportId,
        reviewId: 101,
        reviewContent: "서비스가 정말 최악이었습니다. 기사님도 불친절하고 가격도 터무니없이 비쌉니다. 절대 이용하지 마세요.",
        reviewRating: 1,
        reviewCreatedAt: "2025-09-08T09:00:00Z",
        reportingCenterId: "center001",
        reportingCenterName: "홍길동 카센터",
        reason: "부적절한 언어 사용",
        content: "리뷰에 욕설과 비방이 포함되어 있습니다. 해당 내용은 다른 사용자들에게 불쾌감을 줄 수 있어 신고합니다.",
        status: 'PENDING',
        createdAt: "2025-09-08T10:00:00Z"
      };
      setReportData(tempData);
    } catch (error) {
      console.error("신고 상세 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "신고 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessReport = async (action: 'approve' | 'reject') => {
    if (!reportId || !reportData) return;

    setProcessingAction(action);
    try {
      if (action === 'approve') {
        // 신고 승인 - 리뷰 삭제 등의 조치
        await adminApiService.deleteReviewReport(reportId);
        
        toast({
          title: "신고 승인 완료",
          description: "신고가 승인되어 해당 리뷰가 처리되었습니다."
        });
      } else {
        // 신고 반려
        await adminApiService.deleteReviewReport(reportId);
        
        toast({
          title: "신고 반려 완료",
          description: "신고가 반려되었습니다."
        });
      }
      
      onReportUpdate();
      onClose();
    } catch (error) {
      console.error("신고 처리 실패:", error);
      toast({
        title: "처리 실패",
        description: "신고 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">처리 대기</Badge>;
      case 'PROCESSED':
        return <Badge className="bg-green-100 text-green-800">처리 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleClose = () => {
    setActionReason("");
    setProcessingAction(null);
    onClose();
  };

  if (!reportData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            리뷰 신고 상세
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 신고 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <User className="h-4 w-4" />
                신고자
              </Label>
              <p className="font-semibold">{reportData.reportingCenterName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">상태</Label>
              <div>{getStatusBadge(reportData.status)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                신고된 리뷰 ID
              </Label>
              <p className="font-mono">{reportData.reviewId}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                신고일
              </Label>
              <p>{new Date(reportData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* 신고 사유 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">신고 사유</Label>
            <div className="p-4 bg-muted rounded-lg">
              <p className="whitespace-pre-wrap">{reportData.reason}</p>
            </div>
          </div>

          {/* 신고 상세 내용 */}
          {reportData.content && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">신고 상세 내용</Label>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{reportData.content}</p>
              </div>
            </div>
          )}

          {/* 신고된 리뷰 내용 */}
          {reportData.reviewContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">신고된 리뷰 내용</Label>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 whitespace-pre-wrap">
                  {reportData.reviewContent}
                </p>
                <div className="mt-2 text-xs text-red-600">
                  ⭐ {reportData.reviewRating}점 | 리뷰 ID: #{reportData.reviewId} | 작성일: {new Date(reportData.reviewCreatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {/* 처리 사유 입력 (승인/반려 시) */}
          {processingAction && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-600">
                {processingAction === 'approve' ? '승인' : '반려'} 사유
              </Label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={`${processingAction === 'approve' ? '승인' : '반려'} 사유를 입력하세요...`}
                rows={3}
              />
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={!!processingAction}>
              닫기
            </Button>
            
            {reportData.status === 'PENDING' && (
              <>
                {processingAction === 'reject' ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setProcessingAction(null)}
                    >
                      취소
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleProcessReport('reject')}
                      disabled={!actionReason.trim()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      반려 확정
                    </Button>
                  </>
                ) : processingAction === 'approve' ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setProcessingAction(null)}
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={() => handleProcessReport('approve')}
                      disabled={!actionReason.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      승인 확정
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="destructive" 
                      onClick={() => setProcessingAction('reject')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      반려
                    </Button>
                    <Button 
                      onClick={() => setProcessingAction('approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      승인
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}