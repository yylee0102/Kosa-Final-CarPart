/**
 * 신고된 리뷰 관리 페이지
 * 
 * 이 페이지의 역할:
 * - 사용자들이나 카센터가 신고한 리뷰 목록 조회 및 관리
 * - 신고 상세 내용 확인 및 검토
 * - 신고 처리 완료 (삭제) 기능
 * 
 * 왜 필요한가:
 * - 부적절한 콘텐츠 관리를 통한 플랫폼 건전성 유지
 * - 공정한 리뷰 환경 조성으로 서비스 신뢰도 향상
 * - 체계적인 신고 처리 시스템 구축
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Eye, Trash2, Calendar, MessageSquare, Filter } from "lucide-react";
import ReviewReportDetailModal from "@/shared/modals/ReviewReportDetailModal";
import adminApiService, { ReviewReportResDTO } from "@/services/admin.api";
import PageContainer from "@/shared/components/layout/PageContainer";
import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function ReviewReportManagementPage() {
  const [reports, setReports] = useState<ReviewReportResDTO[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReviewReportResDTO[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    // 상태 필터링
    if (statusFilter === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.status === statusFilter));
    }
  }, [reports, statusFilter]);

  /**
   * 신고된 리뷰 목록 조회
   * API: GET /api/admin/reports/reviews
   */
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 연결 시 사용
      // const data = await adminApiService.getAllReviewReports();
      // setReports(data);
      
      // 개발용 임시 데이터
      const tempReports: ReviewReportResDTO[] = [
        {
          reportId: 1,
          reviewId: 101,
          reviewContent: "서비스가 정말 최악이었습니다. 기사님도 불친절하고 가격도 터무니없이 비쌉니다.",
          reviewRating: 1,
          reviewCreatedAt: "2025-09-08T09:00:00Z",
          reportingCenterId: "center001",
          reportingCenterName: "홍길동 카센터",
          reason: "부적절한 언어 사용",
          content: "리뷰에 욕설과 비방이 포함되어 있습니다. 해당 내용은 다른 사용자들에게 불쾌감을 줄 수 있어 신고합니다.",
          status: 'PENDING',
          createdAt: "2025-09-08T10:00:00Z"
        },
        {
          reportId: 2,
          reviewId: 102,
          reviewContent: "여기 정말 별로예요. 다른 곳 이용하세요. 시간만 낭비했네요.",
          reviewRating: 1,
          reviewCreatedAt: "2025-09-07T08:00:00Z",
          reportingCenterId: "center002",
          reportingCenterName: "김영희 카센터",
          reason: "허위 리뷰 의심",
          content: "해당 리뷰는 실제 서비스를 이용하지 않고 작성된 것으로 보입니다. 경쟁업체의 악의적 리뷰로 판단됩니다.",
          status: 'PENDING',
          createdAt: "2025-09-07T10:00:00Z"
        },
        {
          reportId: 3,
          reviewId: 103,
          reviewContent: "좋은 서비스였습니다. 추천합니다. 다음에도 이용할게요.",
          reviewRating: 5,
          reviewCreatedAt: "2025-09-06T07:00:00Z",
          reportingCenterId: "center003",
          reportingCenterName: "이민수 카센터",
          reason: "스팸성 리뷰",
          content: "동일한 내용의 리뷰를 여러 카센터에 반복적으로 작성하고 있습니다.",
          status: 'PENDING',
          createdAt: "2025-09-06T10:00:00Z"
        }
      ];
      setReports(tempReports);
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
   * 신고 상세 보기
   */
  const handleViewDetail = (reportId: number) => {
      console.log('상세보기 클릭! 전달된 approvalId:', approvalId);

    setSelectedReportId(reportId);
    setShowDetailModal(true);
  };

  /**
   * 신고 처리 완료 (삭제)
   * API: DELETE /api/admin/reports/reviews/{reportId}
   */
  const handleDeleteReport = async (reportId: number, reportReason: string) => {
    if (!confirm(`정말로 이 신고를 처리 완료하시겠습니까?\n\n신고 사유: ${reportReason}`)) {
      return;
    }

    try {
      // TODO: 실제 API 연결 시 사용
      // await adminApiService.deleteReviewReport(reportId);
      
      // 로컬 상태에서 해당 신고 제거
      setReports(prev => prev.filter(report => report.reportId !== reportId));
      
      toast({
        title: "신고 처리 완료",
        description: "신고가 성공적으로 처리되었습니다."
      });
      
    } catch (error) {
      console.error("신고 삭제 실패:", error);
      toast({
        title: "처리 실패",
        description: "신고 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  /**
   * 신고 처리 후 목록 새로고침
   */
  const handleReportUpdate = () => {
    fetchReports();
  };

  /**
   * 상태에 따른 뱃지 반환
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">처리 대기</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">처리 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <div className="container mx-auto px-4 py-6 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">신고된 리뷰 관리</h1>
              <p className="text-on-surface-variant mt-1">
                사용자들이 신고한 리뷰를 확인하고 처리하세요
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                총 {filteredReports.length}건의 신고
              </div>
            </div>
          </div>

          {/* 필터 및 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">처리 대기</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {reports.filter(r => r.status === 'PENDING').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">처리 완료</p>
                    <p className="text-2xl font-bold text-green-600">
                      {reports.filter(r => r.status === 'APPROVED').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-muted-foreground">오늘 신고</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {reports.filter(r => new Date(r.createdAt).toDateString() === new Date().toDateString()).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-purple-500" />
                  <div className="ml-2 w-full">
                    <p className="text-sm font-medium text-muted-foreground mb-2">필터</p>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="PENDING">처리 대기</SelectItem>
                        <SelectItem value="APPROVED">처리 완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 신고 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                신고 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>신고 ID</TableHead>
                    <TableHead>신고자</TableHead>
                    <TableHead>신고 사유</TableHead>
                    <TableHead>리뷰 ID</TableHead>
                    <TableHead>리뷰 내용 (일부)</TableHead>
                    <TableHead>신고일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        데이터를 불러오는 중...
                      </TableCell>
                    </TableRow>
                  ) : filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {statusFilter === "all" ? "신고된 리뷰가 없습니다." : "해당 상태의 신고가 없습니다."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.reportId}>
                        <TableCell className="font-mono">#{report.reportId}</TableCell>
                        <TableCell>{report.reportingCenterName}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="truncate">{report.reason}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">#{report.reviewId}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate">
                              {report.reviewContent?.substring(0, 50)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetail(report.reportId)}
                              title="상세 보기"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {report.status === 'PENDING' && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteReport(report.reportId, report.reason)}
                                title="신고 처리 완료"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* 페이지네이션 */}
              <div className="flex justify-center mt-4">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>이전</Button>
                  <Button size="sm">1</Button>
                  <Button variant="outline" size="sm" disabled>다음</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 보기 모달 */}
          <ReviewReportDetailModal 
            open={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            reportId={selectedReportId}
            onReportUpdate={handleReportUpdate}
          />
        </div>
    </ProtectedRoute>
  );
}