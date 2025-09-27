// KakaoMapComponent.tsx

import { Map, MapMarker } from "react-kakao-maps-sdk";
// ✅ CarCenterResponse 타입을 import 해야 합니다.
import { CarCenterResponse } from "@/services/carCenter.api"; 

// ✅ 1. KakaoMapProps 인터페이스에 onMapLoad를 추가합니다.
interface KakaoMapProps {
  centers: CarCenterResponse[];
  onMarkerClick: (center: CarCenterResponse) => void;
  // 부모로부터 지도 객체를 전달받을 함수 prop
  onMapLoad?: (map: kakao.maps.Map) => void;
}

// ✅ 2. 컴포넌트의 매개변수에도 onMapLoad를 추가합니다.
export function KakaoMapComponent({ centers, onMarkerClick, onMapLoad }: KakaoMapProps) {
  return (
    <Map
      center={{ lat: 37.5665, lng: 126.9780 }}
      style={{ width: "100%", height: "100%" }}
      level={8}
      // ✅ 3. Map 컴포넌트가 생성될 때 부모로부터 받은 onMapLoad 함수를 실행시킵니다.
      onCreate={onMapLoad}
    >
      {centers.map((center) => (
        center.latitude && center.longitude && (
          <MapMarker
            key={center.centerId}
            position={{ lat: center.latitude, lng: center.longitude }}
            onClick={() => onMarkerClick(center)}
          >
            <div style={{ padding: "5px", color: "#000" }}>{center.centerName}</div>
          </MapMarker>
        )
       ))}
    </Map>
  );
}