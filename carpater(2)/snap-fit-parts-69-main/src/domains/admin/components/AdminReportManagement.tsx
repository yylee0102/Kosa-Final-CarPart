/**
 * 신고 및 문의 관리 컴포넌트
 * 
 * 이 컴포넌트의 역할:
 * - 리뷰 신고 목록 조회 및 처리
 * - 1:1 문의 목록 조회 및 답변
 * - 신고/문의 상태 관리
 * 
 * 왜 필요한가:
 * - 부적절한 콘텐츠 관리를 통한 플랫폼 건전성 유지
 * - 사용자 지원 서비스를 통한 만족도 향상
 * - 체계적인 신고 처리 시스템 구축
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
import CsInquiryDetailModal from "@/shared/modals/CsInquiryDetailModal";
import adminApiService, { ReviewReportResDTO, CsInquiryResDTO } from "@/services/admin.api";

export default function AdminReportManagement() {
  /**
   * 상태 관리
   * - selectedCategory: 선택된 신고 카테고리 필터
   * - reports: 리뷰 신고 목록
   * - inquiries: 1:1 문의 목록
   * - 모달 상태들
   */
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reports, setReports] = useState<ReviewReportResDTO[]>([]);
  const [inquiries, setInquiries] = useState<CsInquiryResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
    fetchInquiries();
  }, []);

  /**
   * 리뷰 신고 목록 조회
   * API: GET /api/admin/reports/reviews
   */
  const fetchReports = async () => {
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
          content: "리뷰에 욕설이 포함되어 있습니다.",
          status: 'PENDING',
          createdAt: "2025-09-08T14:30:00Z"
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
          content: "허위 정보가 포함되어 있습니다.",
          status: 'PENDING',
          createdAt: "2025-09-07T16:45:00Z"
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
    }
  };

  /**
   * 1:1 문의 목록 조회
   * API: GET /api/admin/cs
   */
  const fetchInquiries = async () => {
    try {
      // TODO: 실제 API 연결 시 사용
      // const data = await adminApiService.getAllCsInquiries();
      // setInquiries(data);
      
      // 개발용 임시 데이터
      const tempInquiries: CsInquiryResDTO[] = [
        {
          inquiryId: 1,
          userId: "user123",
          userName: "홍길동",
          title: "견적 요청 관련 문의",
          questionContent: "견적 요청 후 연락이 오지 않습니다.",
          status: 'PENDING',
          createdAt: "2025-09-08T14:30:00"
        },
        {
          inquiryId: 2,
          userId: "user456",
          userName: "김영희",
          title: "결제 관련 문의",
          questionContent: "결제 후 서비스 이용에 문제가 있습니다.",
          status: 'PENDING',
          createdAt: "2025-09-07T10:15:00"
        }
      ];
      setInquiries(tempInquiries);
    } catch (error) {
      console.error("문의 목록 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "문의 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  /**
   * 상태에 따른 뱃지 스타일 반환
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">처리 대기</Badge>;
      case "ANSWERED":
      case "PROCESSED":
        return <Badge className="bg-green-100 text-green-800">처리 완료</Badge>;
      case "반려":
        return <Badge className="bg-red-100 text-red-800">반려</Badge>;
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
   * 문의 상세 보기
   */
  const handleViewInquiry = (inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setShowInquiryModal(true);
  };

  /**
   * 신고 처리 후 목록 새로고침
   */
  const handleReportUpdate = () => {
    fetchReports();
  };

  /**
   * 문의 처리 후 목록 새로고침
   */
  const handleInquiryUpdate = () => {
    fetchInquiries();
  };

  /**
   * 신고 삭제 처리
   */
  const handleDeleteReport = async (reportId: number) => {
    if (!confirm("정말로 이 신고를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await adminApiService.deleteReviewReport(reportId);
      toast({
        title: "삭제 완료",
        description: "신고가 성공적으로 삭제되었습니다."
      });
      fetchReports();
    } catch (error) {
      console.error("신고 삭제 실패:", error);
      toast({
        title: "삭제 실패",
        description: "신고 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 신고 사항 관리 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>신고 사항 관리</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="inappropriate">부적절한 내용</SelectItem>
                <SelectItem value="fake">허위 리뷰</SelectItem>
                <SelectItem value="spam">스팸</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">엑셀</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>신고자</TableHead>
                <TableHead>신고 내용</TableHead>
                <TableHead>리뷰 ID</TableHead>
                <TableHead>신고일</TableHead>
                <TableHead>처리 상태</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    데이터를 불러오는 중...
                  </TableCell>
                </TableRow>
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    신고된 리뷰가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.reportId}>
                    <TableCell>{report.reportingCenterName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="max-w-xs truncate">{report.reason}</span>
                        <Badge className="bg-yellow-100 text-yellow-800">처리대기</Badge>
                      </div>
                    </TableCell>
                    <TableCell>#{report.reviewId}</TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewReport(report.reportId)}
                        >
                          보기
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          title="승인"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteReport(report.reportId)}
                          title="삭제"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
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

      {/* 1:1 문의 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>1:1 문의 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>문의일</TableHead>
                <TableHead>처리 상태</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    처리할 문의가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.inquiryId}>
                    <TableCell>{inquiry.userName}</TableCell>
                    <TableCell className="max-w-xs truncate">{inquiry.title}</TableCell>
                    <TableCell>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                    <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewInquiry(inquiry.inquiryId)}
                        >
                          답변하기
                        </Button>
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

      {/* 모달들 */}
      <ReviewReportDetailModal 
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportId={selectedReportId}
        onReportUpdate={handleReportUpdate}
      />

      <CsInquiryDetailModal 
        open={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        inquiryId={selectedInquiryId}
        onInquiryUpdate={handleInquiryUpdate}
      />
    </div>
  );
}