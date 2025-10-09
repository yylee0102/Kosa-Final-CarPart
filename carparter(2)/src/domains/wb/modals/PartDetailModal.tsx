import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2, MessageCircle, Phone, MapPin, Clock, Eye } from "lucide-react";
import BaseModal from "@/shared/components/modal/BaseModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Part {
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
  description: string;
  seller: {
    name: string;
    address: string;
    rating: number;
    phone: string;
  };
  specifications: {
    brand: string;
    partNumber: string;
    year: string;
    model: string;
    engine: string;
  };
}

interface PartDetailModalProps {
  open: boolean;
  onClose: () => void;
  part: Part | null;
}

export default function PartDetailModal({ open, onClose, part }: PartDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(part?.isLiked || false);

  if (!part) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "신품": return "bg-primary text-primary-foreground";
      case "중고A급": return "bg-secondary text-secondary-foreground"; 
      case "중고B급": return "bg-tertiary text-tertiary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === part.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? part.images.length - 1 : prev - 1
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${Math.floor(diffInHours / 24)}일 전`;
  };

  const handleContact = () => {
    // TODO: API 연결 시 연락하기 기능 구현
    console.log("연락하기:", part.seller.phone);
  };

  const handleChat = () => {
    // TODO: API 연결 시 채팅 기능 구현
    console.log("채팅하기:", part.seller.name);
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      size="xl"
      className="max-h-[95vh] overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* 좌측: 이미지 슬라이더 */}
        <div className="space-y-4">
          {/* 메인 이미지 */}
          <div className="relative aspect-square bg-surface-container rounded-lg overflow-hidden">
            {part.images.length > 0 ? (
              <>
                <img 
                  src={part.images[currentImageIndex]} 
                  alt={`${part.title} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {part.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-2 py-1 rounded">
                      {currentImageIndex + 1} / {part.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                이미지 없음
              </div>
            )}
          </div>

          {/* 썸네일 */}
          {part.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {part.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? "border-primary" : "border-outline-variant"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${part.title} 썸네일 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 우측: 상품 정보 */}
        <div className="space-y-6 overflow-y-auto">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-on-surface line-clamp-2">
                {part.title}
              </h1>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? "text-destructive" : "text-on-surface-variant"}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={getConditionColor(part.condition)}>
                {part.condition}
              </Badge>
              <Badge variant="outline">
                {part.sellerType}
              </Badge>
            </div>

            <div className="text-3xl font-bold text-primary">
              {formatPrice(part.price)}
            </div>

            <div className="flex items-center space-x-4 text-sm text-on-surface-variant">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>조회 {part.views}회</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(part.postedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{part.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* 상품 상세 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-on-surface">상품 정보</h3>
            
            {part.oem && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">OEM 번호</span>
                <span className="text-on-surface">{part.oem}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-on-surface-variant">브랜드</span>
              <span className="text-on-surface">{part.specifications.brand}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-on-surface-variant">부품번호</span>
              <span className="text-on-surface">{part.specifications.partNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-on-surface-variant">연식</span>
              <span className="text-on-surface">{part.specifications.year}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-on-surface-variant">차종</span>
              <span className="text-on-surface">{part.specifications.model}</span>
            </div>

            {part.compatible.length > 0 && (
              <div>
                <span className="text-on-surface-variant">호환 차종</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {part.compatible.map((model, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* 상품 설명 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-on-surface">상품 설명</h3>
            <p className="text-on-surface whitespace-pre-wrap">
              {part.description}
            </p>
          </div>

          <Separator />

          {/* 판매자 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-on-surface">판매자 정보</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">판매자</span>
                <span className="text-on-surface">{part.seller.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">평점</span>
                <span className="text-on-surface">⭐ {part.seller.rating}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">연락처</span>
                <span className="text-on-surface">{part.seller.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">위치</span>
                <span className="text-on-surface">{part.seller.address}</span>
              </div>
            </div>
          </div>

          {/* 연락하기 버튼들 */}
          <div className="flex space-x-3 pt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              채팅하기
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleContact}
            >
              <Phone className="h-4 w-4 mr-2" />
              연락하기
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}