import { useState, useEffect } from "react";
import { Plus, Filter, Search, MapPin } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import WBCard from "../components/WBCard";
import PartDetailModal from "../modals/PartDetailModal";
import PartCreateModal from "../modals/PartCreateModal";
import SortFilterModal from "../modals/SortFilterModal";
import EstimateRequestModal from "../modals/EstimateRequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TODO: API 연결 시 실제 타입으로 교체
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

export default function WBListPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // 모달 상태
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSortFilterModal, setShowSortFilterModal] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  
  // 필터 및 정렬 상태
  const [currentSort, setCurrentSort] = useState("latest");
  const [currentFilters, setCurrentFilters] = useState({
    priceRange: [0, 1000000] as [number, number],
    conditions: [] as string[],
    sellerTypes: [] as string[],
    location: ""
  });

  const categories = [
    { value: "all", label: "전체" },
    { value: "engine", label: "엔진부품" },
    { value: "transmission", label: "미션/구동계" },
    { value: "suspension", label: "현가장치" },
    { value: "brake", label: "제동장치" },
    { value: "steering", label: "조향장치" },
    { value: "electrical", label: "전기계통" },
    { value: "cooling", label: "냉각장치" },
    { value: "fuel", label: "연료장치" },
    { value: "exhaust", label: "배기장치" },
    { value: "body", label: "차체부품" },
    { value: "interior", label: "내장부품" },
    { value: "exterior", label: "외장부품" },
    { value: "tire", label: "타이어/휠" },
    { value: "oil", label: "오일/소모품" },
    { value: "etc", label: "기타" }
  ];

  // TODO: API 연결 시 실제 데이터 fetch 로직으로 교체
  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      try {
        // 임시 더미 데이터
        const dummyParts: Part[] = [
          {
            id: "1",
            title: "현대 아반떼 2020년식 헤드라이트 좌측 (신품급)",
            price: 150000,
            images: ["/api/placeholder/300/300"],
            oem: "92101-3X000",
            compatible: ["2018-2022 아반떼", "2019-2021 셀토스"],
            condition: "중고A급",
            location: "서울 강남구",
            postedAt: "2024-09-22T10:00:00Z",
            views: 156,
            isLiked: false,
            sellerType: "개인",
            description: "2020년식 아반떼에서 분리한 헤드라이트입니다.\n사고차량이 아니며, 기능상 문제 전혀 없습니다.\n렌즈에 미세한 스크래치 있으나 야간 주행에 지장 없습니다.",
            seller: {
              name: "김철수",
              address: "서울 강남구 역삼동",
              rating: 4.8,
              phone: "010-1234-5678"
            },
            specifications: {
              brand: "현대",
              partNumber: "92101-3X000",
              year: "2020",
              model: "아반떼",
              engine: "1.6 가솔린"
            }
          },
          {
            id: "2", 
            title: "기아 쏘렌토 범퍼 후면 좌측 - 무사고 차량",
            price: 80000,
            images: ["/api/placeholder/300/300"],
            compatible: ["2015-2020 쏘렌토"],
            condition: "중고B급",
            location: "경기 성남시",
            postedAt: "2024-09-21T15:30:00Z",
            views: 89,
            isLiked: true,
            sellerType: "업체",
            description: "쏘렌토 후면 범퍼입니다.\n색상: 펄 화이트\n긁힘이나 찌그러짐 없는 깨끗한 상태입니다.",
            seller: {
              name: "성남자동차부품",
              address: "경기 성남시 분당구",
              rating: 4.6,
              phone: "031-123-4567"
            },
            specifications: {
              brand: "기아",
              partNumber: "86612-C5000",
              year: "2018",
              model: "쏘렌토",
              engine: "2.2 디젤"
            }
          }
        ];
        
        setParts(dummyParts);
      } catch (error) {
        console.error("부품 목록 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [selectedCategory, currentSort, currentFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연결 시 검색 로직 구현
    console.log("검색:", { keyword: searchKeyword, category: selectedCategory });
  };

  const handlePartClick = (part: Part) => {
    setSelectedPart(part);
    setShowDetailModal(true);
  };

  const handleLike = (partId: string) => {
    // TODO: API 연결 시 찜하기 로직 구현
    setParts(prev => prev.map(part => 
      part.id === partId ? { ...part, isLiked: !part.isLiked } : part
    ));
  };

  const handleCreatePart = (partData: any) => {
    // TODO: API 연결 시 부품 등록 로직 구현
    console.log("부품 등록:", partData);
  };

  const handleApplyFilters = (sort: string, filters: any) => {
    setCurrentSort(sort);
    setCurrentFilters(filters);
    // TODO: API 연결 시 필터 적용 로직 구현
    console.log("필터 적용:", { sort, filters });
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 상단 툴바 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* 카테고리 드롭다운 */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 검색바 */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <Input
                type="text"
                placeholder="부품명, OEM번호, 차종으로 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* 우측 버튼들 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSortFilterModal(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              정렬·필터
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowEstimateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              견적내기
            </Button>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              등록
            </Button>
          </div>
        </div>

        {/* 결과 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-on-surface">중고부품</h1>
            {!loading && (
              <span className="text-on-surface-variant">
                총 {parts.length}개 상품
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <MapPin className="h-4 w-4" />
            <span>전국</span>
          </div>
        </div>

        {/* 상품 그리드 */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-surface-container rounded-lg animate-pulse" />
            ))}
          </div>
        ) : parts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {parts.map(part => (
              <WBCard
                key={part.id}
                part={part}
                onClick={() => handlePartClick(part)}
                onLike={() => handleLike(part.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-on-surface mb-2">검색 결과가 없습니다</h3>
            <p className="text-on-surface-variant mb-6">
              다른 키워드로 검색하거나 필터를 조정해보세요
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchKeyword("");
                setSelectedCategory("all");
                setCurrentFilters({
                  priceRange: [0, 1000000],
                  conditions: [],
                  sellerTypes: [],
                  location: ""
                });
              }}
            >
              검색 조건 초기화
            </Button>
          </div>
        )}

        {/* 모달들 */}
        <PartDetailModal
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          part={selectedPart}
        />

        <PartCreateModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePart}
        />

        <SortFilterModal
          open={showSortFilterModal}
          onClose={() => setShowSortFilterModal(false)}
          currentSort={currentSort}
          currentFilters={currentFilters}
          onApply={handleApplyFilters}
        />

        <EstimateRequestModal
          open={showEstimateModal}
          onClose={() => setShowEstimateModal(false)}
          onSubmit={(data) => {
            console.log("견적 요청:", data);
            setShowEstimateModal(false);
          }}
        />
      </div>
    </PageContainer>
  );
}