import { Heart, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatKRW, formatTimeAgo } from "@/shared/utils/format";

interface WBCardProps {
  part: {
    id: string;
    title: string;
    price: number;
    images: string[];
    oem?: string;
    compatible: string[];
    condition: "신품" | "중고A급" | "중고B급" | "중고C급";
    location: string;
    postedAt: string;
    views: number;
    isLiked?: boolean;
    sellerType: "개인" | "업체";
  };
  onClick: () => void;
  onLike?: () => void;
}

export default function WBCard({ part, onClick, onLike }: WBCardProps) {

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "신품": return "bg-primary text-primary-foreground";
      case "중고A급": return "bg-secondary text-secondary-foreground";
      case "중고B급": return "bg-tertiary text-tertiary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div 
      className="group bg-card border border-outline-variant rounded-lg overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        {part.images.length > 0 ? (
          <img 
            src={part.images[0]} 
            alt={part.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            이미지 없음
          </div>
        )}
        
        {/* 찜하기 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 p-1 rounded-full ${
            part.isLiked 
              ? "bg-destructive text-destructive-foreground" 
              : "bg-black/20 text-white hover:bg-black/30"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
          }}
        >
          <Heart className={`h-4 w-4 ${part.isLiked ? "fill-current" : ""}`} />
        </Button>

        {/* 이미지 개수 표시 */}
        {part.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            +{part.images.length - 1}
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4 space-y-3">
        {/* 제목 */}
        <h3 className="font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
          {part.title}
        </h3>

        {/* 상태 및 호환 정보 */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getConditionColor(part.condition)}>
            {part.condition}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {part.sellerType}
          </Badge>
        </div>

        {/* OEM 정보 */}
        {part.oem && (
          <div className="text-sm text-on-surface-variant">
            <span className="font-medium">OEM:</span> {part.oem}
          </div>
        )}

        {/* 호환 정보 */}
        {part.compatible.length > 0 && (
          <div className="text-sm text-on-surface-variant">
            <span className="font-medium">호환:</span> {part.compatible.slice(0, 2).join(", ")}
            {part.compatible.length > 2 && ` 외 ${part.compatible.length - 2}개`}
          </div>
        )}

        {/* 가격 */}
        <div className="text-lg font-bold text-primary">
          {formatKRW(part.price)}
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(part.postedAt)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{part.views}</span>
            </div>
            <span>{part.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}