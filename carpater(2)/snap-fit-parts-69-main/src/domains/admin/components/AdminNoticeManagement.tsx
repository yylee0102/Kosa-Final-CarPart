import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import AnnouncementEditModal from "@/shared/modals/AnnouncementEditModal";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { AnnouncementResDTO } from "@/services/admin.api";

export default function AdminNoticeManagement() {
  /**
   * 공지사항 관리 컴포넌트
   * 
   * 주요 기능:
   * - 공지사항 목록 조회
   * - 공지사항 작성/수정/삭제
   * - 공지사항 상세 보기
   * 
   * 백엔드 API 연결:
   * - GET /api/admin/announcements - 공지사항 전체 조회
   * - POST /api/admin/announcements - 공지사항 등록
   * - PUT /api/admin/announcements/{id} - 공지사항 수정
   * - DELETE /api/admin/announcements/{id} - 공지사항 삭제
   */
  
  const [notices, setNotices] = useState<AnnouncementResDTO[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 API 연결 시 사용
      // const data = await adminApiService.getAllAnnouncements();
      // setNotices(data);

      // 개발용 임시 데이터
      const tempData: AnnouncementResDTO[] = [
        {
          announcementId: 1,
          title: "서버 업데이트 안내",
          content: "안정적인 서비스 제공을 위해 서버 업데이트를 진행합니다.",
          createdAt: "2025-09-08",
          updatedAt: undefined
        }
      ];
      setNotices(tempData);
    } catch (error) {
      console.error("공지사항 조회 실패:", error);
      toast({
        title: "조회 실패",
        description: "공지사항을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotice = () => {
    setSelectedNoticeId(undefined);
    setShowEditModal(true);
  };

  const handleEditNotice = (noticeId: number) => {
    setSelectedNoticeId(noticeId);
    setShowEditModal(true);
  };

  const handleDeleteNotice = async (noticeId: number) => {
    if (!confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await adminApiService.deleteAnnouncement(noticeId);
      
      toast({
        title: "삭제 완료",
        description: "공지사항이 성공적으로 삭제되었습니다."
      });
      
      fetchNotices();
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
      toast({
        title: "삭제 실패",
        description: "공지사항 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleNoticeUpdate = () => {
    fetchNotices();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>공지 사항 관리</CardTitle>
          <Button onClick={handleCreateNotice}>
            <Plus className="h-4 w-4 mr-2" />
            새 공지사항
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            공지사항을 등록하여 관리할 수 있습니다.
          </p>
        </CardContent>
      </Card>

      {/* 공지사항 목록 */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>번호</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    데이터를 불러오는 중...
                  </TableCell>
                </TableRow>
              ) : notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    등록된 공지사항이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((notice) => (
                  <TableRow key={notice.announcementId}>
                    <TableCell>{notice.announcementId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{notice.title}</span>
                        <Badge className="bg-green-100 text-green-800">공개</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(notice.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" title="상세보기">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditNotice(notice.announcementId)}
                          title="수정"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteNotice(notice.announcementId)}
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* 공지사항 작성/수정 모달 */}
      <AnnouncementEditModal 
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        announcementId={selectedNoticeId}
        onAnnouncementUpdate={handleNoticeUpdate}
      />
    </div>
  );
}