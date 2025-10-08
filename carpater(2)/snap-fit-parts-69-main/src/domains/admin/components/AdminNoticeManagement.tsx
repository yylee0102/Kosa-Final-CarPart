import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { AnnouncementResDTO, AnnouncementReqDTO } from "@/services/admin.api";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import { NoticeEditModal } from "../modals/NoticeEditModal";
import { useAuth } from "@/shared/contexts/AuthContext";

export default function AdminNoticeManagement() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<AnnouncementResDTO[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<AnnouncementResDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getAnnouncements();
      setNotices(data);
    } catch (error) {
      console.error("공지사항 조회 실패:", error);
      toast({ title: "조회 실패", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotice = () => {
    setSelectedNotice(null);
    setShowEditModal(true);
  };

  const handleEditNotice = (notice: AnnouncementResDTO) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const handleDeleteNotice = async (noticeId: number) => {
    if (!confirm("정말로 이 공지사항을 삭제하시겠습니까?")) return;

    try {
      await adminApiService.deleteAnnouncement(noticeId);
      toast({ title: "삭제 완료" });
      fetchNotices();
    } catch (error) {
      toast({ title: "삭제 실패", variant: "destructive" });
    }
  };

  const handleModalSubmit = async (noticeData: Omit<AnnouncementReqDTO, 'admin'> & { noticeId?: number }) => {
    try {
      if (noticeData.noticeId) {
        // 수정 시에는 admin 객체를 보낼 필요가 없습니다 (백엔드가 기존 값을 유지).
        await adminApiService.updateAnnouncement(noticeData.noticeId, {
            title: noticeData.title,
            content: noticeData.content
        });
      } else {
        if (!user?.id) {
          toast({
            title: "인증 오류",
            description: "관리자 정보를 확인할 수 없습니다. 다시 로그인해주세요.",
            variant: "destructive",
          });
          throw new Error("Admin ID is missing");
        }
        
        // ✅ 백엔드의 Announcement 엔티티 구조에 맞춰 admin 객체를 포함한 payload를 생성합니다.
         const payload: AnnouncementReqDTO = {
          title: noticeData.title,
          content: noticeData.content,
          admin: {
            adminId: user.id 
          }
        };
        await adminApiService.createAnnouncement(payload);
      }
      fetchNotices();
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ko-KR');

  return (
    <ProtectedRoute allowedUserTypes={["ADMIN"]}>
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>공지사항 관리</CardTitle>
            <Button onClick={handleCreateNotice}>
              <Plus className="h-4 w-4 mr-2" />
              새 공지사항
            </Button>
          </CardHeader>
        </Card>

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
                  <TableRow><TableCell colSpan={4} className="text-center py-8">로딩 중...</TableCell></TableRow>
                ) : notices.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">등록된 공지사항이 없습니다.</TableCell></TableRow>
                ) : (
                  notices.map((notice) => (
                    <TableRow key={notice.announcementId}>
                      <TableCell>{notice.announcementId}</TableCell>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>{formatDate(notice.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditNotice(notice)} title="수정"><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteNotice(notice.announcementId)} title="삭제"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <NoticeEditModal 
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleModalSubmit}
          notice={selectedNotice}
        />
      </div>
    </ProtectedRoute>
  );
}