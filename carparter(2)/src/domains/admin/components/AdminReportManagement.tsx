/**
 * 신고된 리뷰 관리 페이지
 * - 카센터가 신고한 리뷰 목록 조회 및 관리
 * - 신고 상세 내용 확인 및 검토, 처리
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReviewReportDetailModal from "@/shared/modals/ReviewReportDetailModal";
import adminApiService, { ReviewReportResDTO } from "@/services/admin.api";
import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function ReviewReportManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reports, setReports] = useState<ReviewReportResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  /**
   * 리뷰 신고 목록 조회
   */
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getReviewReports();
      setReports(data);
    } catch (error) {
      console.error("신고 목록 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "신고 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 상태에 따른 뱃지 스타일 반환
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">처리 대기</Badge>;
      case "APPROVED": // 백엔드 상태명에 맞춰 'PROCESSED' 등 사용
        return <Badge className="bg-green-100 text-green-800">처리 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * 신고 상세 보기
   */
  const handleViewReport = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowReportModal(true);
  };

  /**
   * 신고 처리 후 목록 새로고침
   */
  const handleReportUpdate = () => {
    fetchReports();
  };

  /**
   * 신고 삭제 처리
   */
  const handleDeleteReport = async (reportId: number) => {
    if (!confirm("정말로 이 신고를 삭제(처리)하시겠습니까?")) {
      return;
    }

    try {
      await adminApiService.deleteReviewReport(reportId);
      toast({
        title: "처리 완료",
        description: "신고가 성공적으로 처리되었습니다."
      });
      fetchReports();
    } catch (error) {
      console.error("신고 처리 실패:", error);
      toast({
        title: "처리 실패",
        description: "신고 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>신고된 리뷰 관리</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="inappropriate">부적절한 내용</SelectItem>
                  <SelectItem value="fake">허위 리뷰</SelectItem>
                  <SelectItem value="spam">스팸</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>신고자</TableHead>
                  <TableHead>신고 사유</TableHead>
                  <TableHead>리뷰 ID</TableHead>
                  <TableHead>신고일</TableHead>
                  <TableHead>처리 상태</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">로딩 중...</TableCell></TableRow>
                ) : reports.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">신고된 리뷰가 없습니다.</TableCell></TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.reportId}>
                      <TableCell>{report.reportingCenterName}</TableCell>
                      <TableCell className="max-w-xs truncate">{report.reason}</TableCell>
                      <TableCell>#{report.reviewId}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewReport(report.reportId)}>보기</Button>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600" title="승인"><CheckCircle className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteReport(report.reportId)} title="삭제"><XCircle className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>이전</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm" disabled>다음</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ReviewReportDetailModal 
          open={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportId={selectedReportId}
          onReportUpdate={handleReportUpdate}
        />
      </div>
    </ProtectedRoute>
  );
}