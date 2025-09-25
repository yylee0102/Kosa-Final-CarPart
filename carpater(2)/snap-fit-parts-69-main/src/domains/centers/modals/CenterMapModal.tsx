import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Phone } from "lucide-react";

interface CarCenter {
  centerId: string;
  centerName: string;
  businessNumber: string;
  address: string;
  phone: string;
  rating?: number;
  totalReviews?: number;
  isApproved: boolean;
  createdAt: string;
}

interface CenterMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  centers: CarCenter[];
}

export default function CenterMapModal({ 
  isOpen, 
  onClose, 
  centers 
}: CenterMapModalProps) {
  const [selectedCenter, setSelectedCenter] = useState<CarCenter | null>(null);

  const handleDirections = (center: CarCenter) => {
    // 네이버 지도 길찾기 링크 (임시 좌표)
    const url = `https://map.naver.com/v5/directions/127.027618,37.497952`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>지도에서 카센터 찾기</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full gap-4">
          {/* 지도 영역 */}
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>지도 API 연결 필요</p>
              <p className="text-sm">네이버 지도 또는 카카오 지도 API</p>
            </div>
          </div>
          
          {/* 카센터 목록 */}
          <div className="w-80 space-y-3 overflow-y-auto">
            {centers.map((center) => (
              <Card 
                key={center.centerId}
                className={`cursor-pointer transition-colors ${
                  selectedCenter?.centerId === center.centerId ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCenter(center)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm text-on-surface">{center.centerName}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-2">{center.address}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span>{center.rating || 0}★ ({center.totalReviews || 0})</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirections(center);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      길찾기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* 선택된 카센터 상세 정보 */}
        {selectedCenter && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-on-surface">{selectedCenter.centerName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium text-on-surface">{selectedCenter.rating || 0}</span>
                    <span className="text-on-surface-variant">
                      ({selectedCenter.totalReviews || 0})
                    </span>
                  </div>
                  {selectedCenter.isApproved && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      승인완료
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedCenter.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Phone className="h-4 w-4" />
                  <span>{selectedCenter.phone}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleDirections(selectedCenter)}>
                  길찾기
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  견적 요청
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}