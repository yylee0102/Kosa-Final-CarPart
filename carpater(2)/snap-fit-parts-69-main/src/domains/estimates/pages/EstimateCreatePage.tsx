import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CarInfo {
  carModel: string;
  carNumber: string;
  modelYear: string;
}

interface EstimateRequest {
  description: string; // = QuoteRequest.requestDetails
  carInfo: CarInfo;    // UI 입력값 (백엔드 연동 시 UserCar로 매핑)
  location: string;    // = QuoteRequest.address
  images: File[];
  centerId?: string;
}

export default function EstimateCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // 카센터에서 넘어온 경우 센터 정보
  const centerInfo = location.state as { centerId?: string; centerName?: string } | null;

  const [formData, setFormData] = useState<EstimateRequest>({
    description: "",
    carInfo: {
      carModel: "",
      carNumber: "",
      modelYear: ""
    },
    location: "",
    images: [],
    centerId: centerInfo?.centerId
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EstimateRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCarInfoChange = (field: keyof CarInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      carInfo: {
        ...prev.carInfo,
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > 5) {
      toast({
        title: "이미지는 최대 5장까지 업로드 가능합니다",
        variant: "destructive"
      });
      return;
    }

    // 파일 크기 체크 (5MB 제한)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast({
        title: "파일 크기는 5MB 이하만 업로드 가능합니다",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // 미리보기 생성
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      toast({ title: "요청 상세 내용을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.carInfo.carModel.trim()) {
      toast({ title: "차량 모델을 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.carInfo.carNumber.trim()) {
      toast({ title: "차량 번호를 입력해주세요", variant: "destructive" });
      return false;
    }
    if (!formData.location.trim()) {
      toast({ title: "주소를 입력해주세요", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // API 연결: 견적 요청 생성 (QuoteRequest 엔티티 기준)
      // POST /api/quote-requests
      const formDataToSend = new FormData();
      formDataToSend.append('requestDetails', formData.description);
      formDataToSend.append('address', formData.location);
      formDataToSend.append('carInfo', JSON.stringify(formData.carInfo));
      
      if (formData.centerId) {
        formDataToSend.append('centerId', formData.centerId);
      }

      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      // 임시: 성공 응답 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "견적 요청이 등록되었습니다",
        description: "카센터들이 견적을 보내면 알림으로 안내드리겠습니다."
      });

      navigate("/estimates");
      
    } catch (error) {
      console.error("견적 요청 등록 실패:", error);
      toast({
        title: "견적 요청 등록에 실패했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">견적 요청하기</h1>
            {centerInfo && (
              <Badge variant="secondary" className="mt-2">
                {centerInfo.centerName}에 요청
              </Badge>
            )}
          </div>

          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-on-surface">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">수리 요청 내용 *</Label>
                <Textarea
                  id="description"
                  placeholder="수리가 필요한 부분에 대해 자세히 설명해주세요..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">주소 *</Label>
                <Input
                  id="location"
                  placeholder="예: 서울시 강남구"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 차량 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-on-surface">차량 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carModel">차량 모델 *</Label>
                  <Input
                    id="carModel"
                    placeholder="예: 현대 소나타"
                    value={formData.carInfo.carModel}
                    onChange={(e) => handleCarInfoChange("carModel", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="carNumber">차량 번호 *</Label>
                  <Input
                    id="carNumber"
                    placeholder="예: 12가3456"
                    value={formData.carInfo.carNumber}
                    onChange={(e) => handleCarInfoChange("carNumber", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="modelYear">연식</Label>
                <Input
                  id="modelYear"
                  placeholder="예: 2020"
                  value={formData.carInfo.modelYear}
                  onChange={(e) => handleCarInfoChange("modelYear", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 이미지 업로드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-on-surface">사진 첨부</CardTitle>
              <p className="text-sm text-on-surface-variant">
                문제 부분의 사진을 첨부하면 더 정확한 견적을 받을 수 있습니다. (최대 5장)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`미리보기 ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {formData.images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-surface">
                      <Camera className="h-8 w-8 text-on-surface-variant mb-2" />
                      <span className="text-sm text-on-surface-variant">사진 추가</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "등록 중..." : "견적 요청하기"}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}