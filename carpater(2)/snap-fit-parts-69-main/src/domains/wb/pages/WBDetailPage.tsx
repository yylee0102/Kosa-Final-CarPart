import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Star, Calendar, Eye } from "lucide-react";
import { useModal } from "@/shared/hooks/useModal";
import ImageViewerModal from "@/shared/modals/ImageViewerModal";
import { formatKRW, formatTimeAgo } from "@/shared/utils/format";

interface WBPart {
  id: string;
  title: string;
  price: number;
  condition: "신품" | "중고A급" | "중고B급" | "중고C급";
  description: string;
  images: string[];
  location: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    phone: string;
    profileImage?: string;
  };
  car: {
    make: string;
    model: string;
    year: number;
  };
  specifications: {
    partNumber?: string;
    compatibility: string[];
    warranty: string;
  };
  createdAt: string;
  viewCount: number;
  isLiked: boolean;
  status: "판매중" | "예약중" | "판매완료";
}

export default function WBDetailPage() {
  const { partId } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState<WBPart | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const imageViewerModal = useModal();

  useEffect(() => {
    // API 연결: 중고부품 상세 정보 조회
    // GET /api/wb/parts/{partId}
    fetchPartDetail();
  }, [partId]);

  const fetchPartDetail = async () => {
    try {
      setLoading(true);
      
      // 임시 데이터 (실제로는 API 호출)
      const mockPart: WBPart = {
        id: partId || "1",
        title: "현대 아반떼 HD 헤드라이트 (좌측)",
        price: 150000,
        condition: "중고A급",
        description: "2011년식 현대 아반떼 HD 순정 헤드라이트입니다. 외관상 흠집 거의 없고, 램프 작동 완벽합니다. 직접 차량에서 분리한 정품 부품이며, 동일 차종에 바로 장착 가능합니다.",
        images: [
          "/api/placeholder/400/300",
          "/api/placeholder/400/300",
          "/api/placeholder/400/300"
        ],
        location: "서울시 강남구",
        seller: {
          id: "seller1",
          name: "김부품",
          rating: 4.8,
          phone: "010-1234-5678",
          profileImage: "/api/placeholder/40/40"
        },
        car: {
          make: "현대",
          model: "아반떼",
          year: 2011
        },
        specifications: {
          partNumber: "92101-1R000",
          compatibility: ["아반떼 HD (2010-2013)", "아반떼 MD (2010-2015)"],
          warranty: "7일 무상교환"
        },
        createdAt: "2024-01-10T10:30:00Z",
        viewCount: 156,
        isLiked: false,
        status: "판매중"
      };

      setPart(mockPart);
    } catch (error) {
      console.error("부품 상세 정보 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    // 전화 걸기 기능
    if (part?.seller.phone) {
      window.location.href = `tel:${part.seller.phone}`;
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    imageViewerModal.open();
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "신품": return "bg-primary text-primary-foreground";
      case "중고A급": return "bg-secondary text-secondary-foreground";
      case "중고B급": return "bg-tertiary text-tertiary-foreground";
      case "중고C급": return "bg-surface-container text-on-surface";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "판매중": return "bg-green-100 text-green-800";
      case "예약중": return "bg-yellow-100 text-yellow-800";
      case "판매완료": return "bg-gray-100 text-gray-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="h-96 bg-surface rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-surface rounded" />
              <div className="h-6 bg-surface rounded w-3/4" />
              <div className="h-24 bg-surface rounded" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!part) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface mb-4">부품을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate("/wb")}>부품 목록으로 돌아가기</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이미지 영역 */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-outline">
              <img
                src={part.images[selectedImageIndex] || part.images[0]}
                alt={part.title}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleImageClick(selectedImageIndex)}
              />
            </div>
            
            {part.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {part.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square overflow-hidden rounded border-2 cursor-pointer ${
                      index === selectedImageIndex ? 'border-primary' : 'border-outline'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${part.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(part.status)}>
                  {part.status}
                </Badge>
                <Badge className={getConditionColor(part.condition)}>
                  {part.condition}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-on-surface mb-2">{part.title}</h1>
              <p className="text-4xl font-bold text-primary mb-4">{formatKRW(part.price)}</p>
              
              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {part.location}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  조회 {part.viewCount}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatTimeAgo(part.createdAt)}
                </div>
              </div>
            </div>

            {/* 차량 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">차량 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-on-surface-variant">제조사:</span>
                    <span className="ml-2 font-medium">{part.car.make}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">모델:</span>
                    <span className="ml-2 font-medium">{part.car.model}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">연식:</span>
                    <span className="ml-2 font-medium">{part.car.year}년</span>
                  </div>
                  {part.specifications.partNumber && (
                    <div>
                      <span className="text-on-surface-variant">부품번호:</span>
                      <span className="ml-2 font-medium">{part.specifications.partNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 호환 차종 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">호환 차종</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {part.specifications.compatibility.map((model, index) => (
                    <Badge key={index} variant="outline">
                      {model}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-on-surface-variant mt-2">
                  품질보증: {part.specifications.warranty}
                </p>
              </CardContent>
            </Card>

            {/* 상품 설명 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">상품 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-on-surface-variant whitespace-pre-line">
                  {part.description}
                </p>
              </CardContent>
            </Card>

            {/* 판매자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">판매자 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={part.seller.profileImage} />
                    <AvatarFallback>{part.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-on-surface">{part.seller.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{part.seller.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{part.seller.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 액션 버튼들 */}
            <div className="flex gap-2">
              <Button onClick={handleContact} className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                판매자 연락
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 뷰어 모달 */}
      <ImageViewerModal
        isOpen={imageViewerModal.isOpen}
        onClose={imageViewerModal.close}
        images={part.images}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
      />
    </PageContainer>
  );
}