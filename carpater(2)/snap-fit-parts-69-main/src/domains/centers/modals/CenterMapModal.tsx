import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// ✅ [수정 1] 올바른 경로에서 올바른 타입 이름(CarCenterResponse)을 가져옵니다.
// 'as CarCenter'를 사용해 이 파일 내에서는 'CarCenter'라는 짧은 이름으로 사용할 수 있게 합니다.
import { CarCenterResponse as CarCenter } from "@/services/carCenter.api"; 
import { KakaoMapComponent } from "./KakaoMapComponent"; 
import { MapPin, Phone } from "lucide-react";

interface CenterMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  centers: CarCenter[];
}

export default function CenterMapModal({ isOpen, onClose, centers }: CenterMapModalProps) {
  const [selectedCenter, setSelectedCenter] = useState<CarCenter | null>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 모달이 열릴 때 지도 크기 및 위치를 재조정하는 로직
  useEffect(() => {
    if (isOpen && map && centers.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      centers.forEach(center => {
        if (center.latitude && center.longitude) {
          bounds.extend(new kakao.maps.LatLng(center.latitude, center.longitude));
        }
      });
      
      const timer = setTimeout(() => {
        map.relayout();
        map.setBounds(bounds);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, map, centers]);

  // 길찾기 함수
  const handleDirections = (center: CarCenter) => {
    if (!center.latitude || !center.longitude) {
      alert("이 카센터의 위치 정보가 등록되지 않았습니다.");
      return;
    }
    const url = `https://map.kakao.com/link/to/${center.centerName},${center.latitude},${center.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="korean-text">지도에서 카센터 찾기</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 overflow-hidden">
          {/* 지도 영역 */}
          <div className="md:col-span-2 h-full rounded-lg overflow-hidden">
            <KakaoMapComponent
              centers={centers}
              onMarkerClick={setSelectedCenter}
              // ✅ [수정 2] onMapLoad prop 타입을 맞춰주기 위해 직접 함수를 전달합니다.
              onMapLoad={(mapInstance) => setMap(mapInstance)}
            />
          </div>

          {/* 카센터 목록 영역 */}
          <div className="md:col-span-1 h-full overflow-y-auto space-y-3">
            <h3 className="text-lg font-semibold korean-text mb-2">카센터 목록 ({centers.length}개)</h3>
            {centers.map((center) => (
              <Card 
                // ✅ [수정 3] 고유한 key prop으로 centerId를 사용합니다.
                key={center.centerId}
                className={`cursor-pointer transition-all ${
                  selectedCenter?.centerId === center.centerId 
                    ? 'ring-2 ring-blue-500 shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCenter(center)}
              >
                <CardContent className="p-3">
                  <p className="font-semibold text-sm korean-text truncate">{center.centerName}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">{center.address}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* 선택된 카센터 상세 정보 */}
        <div className="border-t">
          {selectedCenter ? (
            <div className="flex justify-between items-center p-6">
              <div>
                <h3 className="font-bold text-lg korean-text">{selectedCenter.centerName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedCenter.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Phone className="h-4 w-4" />
                  <span>{selectedCenter.phoneNumber || '전화번호 정보 없음'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleDirections(selectedCenter)}>
                  길찾기
                </Button>
                <Button variant="outline">
                  상세보기
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6 korean-text">
              목록에서 카센터를 선택하거나 지도에서 마커를 클릭하세요.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}