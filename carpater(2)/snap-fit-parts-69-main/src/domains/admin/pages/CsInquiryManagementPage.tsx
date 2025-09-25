/**
 * 1:1 문의 관리 페이지
 * 
 * 이 페이지의 역할:
 * - 사용자가 보낸 1:1 문의 목록 조회
 * - 문의 상세 내용 확인
 * - 관리자 답변 등록 및 수정
 * - 문의 상태 관리 (대기/답변완료)
 * 
 * 왜 필요한가:
 * - 사용자 지원 서비스를 통한 만족도 향상
 * - 체계적인 문의 처리 시스템 구축
 * - 빠른 고객 응대로 서비스 신뢰도 증진
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";
import adminApiService, { CsInquiryResDTO } from "@/services/admin.api";
import PageContainer from "@/shared/components/layout/PageContainer";
import ProtectedRoute from "@/shared/components/ProtectedRoute";

export default function CsInquiryManagementPage() {
  const [inquiries, setInquiries] = useState<CsInquiryResDTO[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<CsInquiryResDTO | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, []);

  /**
   * 1:1 문의 목록 조회
   * API: GET /api/admin/cs
   */
  const fetchInquiries = async () => {
    setIsLoading(true);
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
          questionContent: "견적 요청 후 연락이 오지 않습니다. 언제쯤 연락을 받을 수 있을까요?",
          status: 'PENDING',
          createdAt: "2025-09-08T14:30:00"
        },
        {
          inquiryId: 2,
          userId: "user456",
          userName: "김영희",
          title: "결제 관련 문의",
          questionContent: "결제 후 서비스 이용에 문제가 있습니다. 확인 부탁드립니다.",
          status: 'PENDING',
          createdAt: "2025-09-07T10:15:00"
        },
        {
          inquiryId: 3,
          userId: "user789",
          userName: "이민수",
          title: "계정 관련 문의",
          questionContent: "계정 비밀번호 변경이 안됩니다.",
          answerContent: "비밀번호 재설정 링크를 이메일로 발송해드렸습니다. 확인 부탁드립니다.",
          status: 'ANSWERED',
          createdAt: "2025-09-06T16:20:00",
          answeredAt: "2025-09-06T17:45:00"
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
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 문의 상세 보기
   */
  const handleViewInquiry = (inquiry: CsInquiryResDTO) => {
    setSelectedInquiry(inquiry);
    setAnswerContent(inquiry.answerContent || "");
  };

  /**
   * 답변 저장
   * API: PUT /api/admin/cs/{inquiryId}/answer
   */
  const handleSaveAnswer = async () => {
    if (!selectedInquiry || !answerContent.trim()) {
      toast({
        title: "입력 오류",
        description: "답변 내용을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedInquiry: CsInquiryResDTO = {
        ...selectedInquiry,
        answerContent: answerContent.trim(),
        status: 'ANSWERED',
        answeredAt: new Date().toISOString()
      };

      // TODO: 실제 API 연결 시 사용
      // await adminApiService.answerInquiry(selectedInquiry.inquiryId, updatedInquiry);

      // 로컬 상태 업데이트
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.inquiryId === selectedInquiry.inquiryId 
            ? updatedInquiry 
            : inquiry
        )
      );

      setSelectedInquiry(updatedInquiry);

      toast({
        title: "답변 저장 완료",
        description: "고객 문의에 대한 답변이 등록되었습니다."
      });

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

  /**
   * 상태에 따른 뱃지 반환
   */
  const getStatusBadge = (status: string, answeredAt?: string) => {
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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute allowedUserTypes={["관리자"]} fallbackMessage="관리자만 접근할 수 있는 페이지입니다.">
      <PageContainer>
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-on-surface">1:1 문의 관리</h1>
              <p className="text-on-surface-variant mt-1">
                고객 문의를 확인하고 답변을 등록하세요
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 문의 목록 */}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          데이터를 불러오는 중...
                        </TableCell>
                      </TableRow>
                    ) : inquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          처리할 문의가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      inquiries.map((inquiry) => (
                        <TableRow 
                          key={inquiry.inquiryId}
                          className={`cursor-pointer hover:bg-muted/50 ${
                            selectedInquiry?.inquiryId === inquiry.inquiryId ? 'bg-muted' : ''
                          }`}
                          onClick={() => handleViewInquiry(inquiry)}
                        >
                          <TableCell className="max-w-xs truncate">{inquiry.title}</TableCell>
                          <TableCell>{inquiry.userName}</TableCell>
                          <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(inquiry.status, inquiry.answeredAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 문의 상세 및 답변 */}
            <Card>
              <CardHeader>
                <CardTitle>문의 상세 및 답변</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedInquiry ? (
                  <div className="space-y-6">
                    {/* 문의 정보 */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedInquiry.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>작성자: {selectedInquiry.userName}</span>
                          <span>작성일: {formatDate(selectedInquiry.createdAt)}</span>
                          {getStatusBadge(selectedInquiry.status, selectedInquiry.answeredAt)}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">문의 내용</h4>
                        <div className="p-4 bg-muted rounded-md">
                          {selectedInquiry.questionContent}
                        </div>
                      </div>
                    </div>

                    {/* 답변 영역 */}
                    <div className="space-y-4">
                      <h4 className="font-medium">답변</h4>
                      <Textarea
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        placeholder="고객 문의에 대한 답변을 작성해주세요..."
                        className="min-h-32"
                        disabled={isSaving}
                      />
                      
                      {selectedInquiry.answeredAt && (
                        <p className="text-sm text-muted-foreground">
                          답변일: {formatDate(selectedInquiry.answeredAt)}
                        </p>
                      )}
                      
                      <Button 
                        onClick={handleSaveAnswer}
                        disabled={!answerContent.trim() || isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          "저장 중..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            {selectedInquiry.status === 'ANSWERED' ? '답변 수정' : '답변 등록'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>문의를 선택하여 상세 내용을 확인하고 답변을 작성하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}