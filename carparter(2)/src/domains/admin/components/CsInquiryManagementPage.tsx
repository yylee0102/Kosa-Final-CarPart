/**
 * 1:1 문의 관리 페이지
 * - 사용자가 보낸 1:1 문의 목록 조회 및 답변
 */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import CsInquiryDetailModal from "@/shared/modals/CsInquiryDetailModal"; // ✅ 문의 상세 모달 임포트
import adminApiService, { CsInquiryResDTO } from "@/services/admin.api";
import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function CsInquiryManagementPage() {
  const [inquiries, setInquiries] = useState<CsInquiryResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, []);

  /**
   * 1:1 문의 목록 조회
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
        description: "문의 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 상태에 따른 뱃지 스타일 반환
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
   * 문의 상세 보기 (모달 열기)
   */
  const handleViewInquiry = (inquiryId: number) => {
    setSelectedInquiryId(inquiryId);
    setShowInquiryModal(true);
  };

  /**
   * 문의 처리 후 목록 새로고침
   */
  const handleInquiryUpdate = () => {
    fetchInquiries();
  };

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <div className="container mx-auto p-6 space-y-6">
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
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">로딩 중...</TableCell></TableRow>
                ) : inquiries.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">처리할 문의가 없습니다.</TableCell></TableRow>
                ) : (
                  inquiries.map((inquiry) => (
                    <TableRow key={inquiry.inquiryId}>
                      <TableCell>{inquiry.userName}</TableCell>
                      <TableCell className="max-w-xs truncate">{inquiry.title}</TableCell>
                      <TableCell>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewInquiry(inquiry.inquiryId)}>답변하기</Button>
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

        {/* ✅ 문의 상세/답변 모달 */}
        <CsInquiryDetailModal 
          open={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          inquiryId={selectedInquiryId}
          onInquiryUpdate={handleInquiryUpdate}
        />
      </div>
    </ProtectedRoute>
  );
}