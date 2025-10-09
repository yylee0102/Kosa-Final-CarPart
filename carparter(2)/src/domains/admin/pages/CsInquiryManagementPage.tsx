/**
 * 1:1 문의 관리 페이지
 * - 사용자가 보낸 1:1 문의 목록을 조회하고 관리합니다.
 * - 상세 내용 확인 및 답변은 모달을 통해 처리합니다.
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import adminApiService, { CsInquiryResDTO } from "@/services/admin.api";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import CsInquiryDetailModal from "@/shared/modals/CsInquiryDetailModal"; // ✅ 모달 컴포넌트 임포트

export default function CsInquiryManagementPage() {
  const [inquiries, setInquiries] = useState<CsInquiryResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // ✅ 모달 상태 관리
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  /**
   * 1:1 문의 목록 조회 (API 연동)
   */
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getCsInquiries();
      setInquiries(data);
    } catch (error) {
      console.error("문의 목록 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "문의 목록을 불러오는 데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 문의 상세 보기 (모달 열기)
   */
  const handleViewInquiry = (inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setShowModal(true);
  };
  
  /**
   * 모달에서 답변 저장 후 목록 새로고침
   */
  const handleInquiryUpdate = () => {
    fetchInquiries();
  };

  /**
   * 상태에 따른 뱃지 반환
   */
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">답변 대기</Badge>;
      case "ANSWERED":
        return <Badge className="bg-green-100 text-green-800">답변 완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-on-surface">1:1 문의 관리</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              문의 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">데이터를 불러오는 중...</TableCell></TableRow>
                ) : inquiries.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">처리할 문의가 없습니다.</TableCell></TableRow>
                ) : (
                  inquiries.map((inquiry) => (
                    <TableRow key={inquiry.inquiryId}>
                      <TableCell className="max-w-xs truncate font-medium">{inquiry.title}</TableCell>
                      <TableCell>{inquiry.userName}</TableCell>
                      <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleViewInquiry(inquiry.inquiryId)}>
                          답변하기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ✅ 상세/답변 모달 렌더링 */}
      <CsInquiryDetailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        inquiryId={selectedInquiryId}
        onInquiryUpdate={handleInquiryUpdate}
      />
    </ProtectedRoute>
  );
}