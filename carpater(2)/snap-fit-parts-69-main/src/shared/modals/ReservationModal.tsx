// 예약 관리 모달 (임시)
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  reservation?: any;
  mode: "view" | "edit" | "create";
}

export default function ReservationModal({ 
  open, 
  onClose, 
  reservation,
  mode = "create" 
}: ReservationModalProps) {
  const [formData, setFormData] = useState({
    customerName: reservation?.customerName || "",
    phone: reservation?.phone || "",
    vehicle: reservation?.vehicle || "",
    service: reservation?.service || "",
    date: reservation?.date ? new Date(reservation.date) : new Date(),
    time: reservation?.time || "",
    notes: reservation?.notes || ""
  });

  const handleSave = () => {
    console.log("예약 저장:", formData);
    alert("예약이 저장되었습니다!");
    onClose();
  };

  const handleDelete = () => {
    if (confirm("예약을 삭제하시겠습니까?")) {
      console.log("예약 삭제:", reservation?.id);
      alert("예약이 삭제되었습니다!");
      onClose();
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "새 예약 등록" : 
             mode === "edit" ? "예약 수정" : "예약 상세"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">고객명</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vehicle">차량 정보</Label>
            <Input
              id="vehicle"
              placeholder="예: 현대 아반떼 2020년"
              value={formData.vehicle}
              onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="service">서비스 종류</Label>
            <Select 
              value={formData.service} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="서비스를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engine">엔진 점검</SelectItem>
                <SelectItem value="brake">브레이크 점검</SelectItem>
                <SelectItem value="tire">타이어 교체</SelectItem>
                <SelectItem value="oil">오일 교환</SelectItem>
                <SelectItem value="inspection">종합 점검</SelectItem>
                <SelectItem value="repair">일반 수리</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>예약 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isReadOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "MM/dd") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">시간</Label>
              <Select 
                value={formData.time} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">요청사항</Label>
            <Textarea
              id="notes"
              placeholder="특별한 요청사항이 있으시면 작성해주세요"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={isReadOnly}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            {mode === "view" ? (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  닫기
                </Button>
                <Button onClick={() => {/* 수정 모드로 전환 */}} className="flex-1">
                  수정
                </Button>
              </>
            ) : mode === "edit" ? (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  취소
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  삭제
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  저장
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  취소
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  등록
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}