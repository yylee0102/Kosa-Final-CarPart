/**
 * 카센터 승인 관리 컴포넌트
 * - 가입 신청 목록 조회 / 상세 / 승인/반려
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import CenterApprovalDetailModal from "@/shared/modals/CenterApprovalDetailModal";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { CarCenterApprovalResDTO } from "@/services/admin.api";

export default function AdminCenterApproval() {
  const { toast } = useToast();
  const [selectedApprovalId, setSelectedApprovalId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ✅ 승인 대기 목록 API 연결
  const {
    data: pendingCenters = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery<CarCenterApprovalResDTO[]>({
    queryKey: ["admin", "approvals", "pending"],
    queryFn: adminApiService.getPendingApprovals,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  if (isError) {
    console.error("승인 대기 목록 조회 실패:", error);
  }

  const handleViewDetail = (approvalId: number) => {
      console.log('클릭된 approvalId:', approvalId);

    setSelectedApprovalId(approvalId);
    setShowDetailModal(true);
  };

  // ✅ 상세 모달에서 승인/반려 처리 후 목록 새로고침
  const handleApprovalUpdate = async () => {
    await refetch();
    toast({
      title: "갱신 완료",
      description: "승인 상태가 반영되었습니다.",
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">승인 대기</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">승인 완료</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">반려</Badge>;
      default:
        return <Badge variant="outline">{status ?? "-"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>카센터 가입 승인 관리</CardTitle>
          <p className="text-sm text-muted-foreground">
            새로 가입한 카센터의 승인 요청을 관리할 수 있습니다.
          </p>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>카센터명</TableHead>
                <TableHead>사업자번호</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>주소</TableHead>
                <TableHead>신청일</TableHead>
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
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-600">
                    승인 대기 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : pendingCenters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    승인 대기 중인 카센터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                pendingCenters.map((center) => (
                  <TableRow key={center.approvalId}>
                    <TableCell className="font-medium">{center.centerName}</TableCell>
                    <TableCell className="font-mono">{center.businessNumber ?? "-"}</TableCell>
                    <TableCell>{center.phoneNumber ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{center.address ?? "-"}</TableCell>
                       <TableCell>{center.requestedAt ? center.requestedAt.slice(0, 10) : "-"}</TableCell>
                    <TableCell>{getStatusBadge(center.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(center.approvalId)}
                          title="상세보기"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 페이지네이션 자리 (백엔드/쿼리 파라미터 확정 후 구현) */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>이전</Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>다음</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 모달 */}
      <CenterApprovalDetailModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        approvalId={selectedApprovalId}
        onApprovalUpdate={handleApprovalUpdate}
      />
    </div>
  );
}