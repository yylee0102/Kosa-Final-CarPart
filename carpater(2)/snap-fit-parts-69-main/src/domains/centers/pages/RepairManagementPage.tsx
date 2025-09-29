import React, { useState, useEffect } from 'react';
import completedRepairApi, { CompletedRepairResDTO } from '@/services/completedRepair.api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash2, Loader2, Info } from 'lucide-react';
import { RepairDetailModal } from '../modals/RepairDetailModal'; // 방금 만든 모달 import

export const RepairManagementPage = () => {
  const { toast } = useToast();
  const [repairs, setRepairs] = useState<CompletedRepairResDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 모달 상태 관리
  const [selectedRepair, setSelectedRepair] = useState<CompletedRepairResDTO | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    setIsLoading(true);
    try {
      // 이제 '진행중'과 '완료됨' 목록을 모두 가져옵니다.
      const allRepairs = await completedRepairApi.getCompletedRepairsForCenter();
      setRepairs(allRepairs);
    } catch (error) {
      toast({ title: "수리 내역을 불러오는데 실패했습니다.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (repair: CompletedRepairResDTO) => {
    setSelectedRepair(repair);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (repairId: number) => {
     // 사용자가 아닌 카센터는 삭제 권한이 없으므로 주석 처리 (필요시 API 추가 후 활성화)
     alert("카센터는 수리 내역을 삭제할 수 없습니다.");
     /*
    if (!window.confirm("정말로 이 수리 내역을 삭제하시겠습니까?")) return;
    try {
      // await completedRepairApi.deleteRepairForCenter(repairId); // API 필요
      toast({ title: "수리 내역이 삭제되었습니다." });
      loadRepairs();
    } catch (error) {
      toast({ title: "삭제에 실패했습니다.", variant: 'destructive' });
    }
    */
  };

  const handleMarkAsComplete = async (repairId: number) => {
    try {
      await completedRepairApi.markAsCompleted(repairId);
      toast({ title: "수리가 완료 처리되었습니다." });
      setIsDetailModalOpen(false); // 모달 닫기
      loadRepairs(); // 목록 새로고침
    } catch (error) {
      toast({ title: "완료 처리에 실패했습니다.", variant: 'destructive' });
    }
  };

  // 진행중인 작업과 완료된 작업을 분리
  const inProgressRepairs = repairs.filter(r => r.status === 'IN_PROGRESS');

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>진행중인 수리 관리</CardTitle>
          </CardHeader>
          <CardContent>
            {inProgressRepairs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3">
                 <Info className="h-8 w-8" />
                 <p>현재 진행중인 수리가 없습니다.</p>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>고객명</TableHead>
                  <TableHead>수리 내용</TableHead>
                  <TableHead>견적 금액</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inProgressRepairs.map(repair => (
                  <TableRow key={repair.id}>
                    <TableCell>{repair.userName}</TableCell>
                    <TableCell className="truncate max-w-xs">{repair.repairDetails}</TableCell>
                    <TableCell>{repair.finalCost.toLocaleString()}원</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(repair)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(repair.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 상세보기 및 수정 모달 렌더링 */}
      <RepairDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        repair={selectedRepair}
        onMarkAsComplete={handleMarkAsComplete}
      />
    </>
  );
};