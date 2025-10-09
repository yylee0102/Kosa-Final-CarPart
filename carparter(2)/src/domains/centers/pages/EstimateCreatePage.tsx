// 견적서 작성 페이지 (임시)
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Save, Send, Calculator, Plus, Minus } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EstimateItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  grade: string;
}

export default function EstimateCreatePage() {
  const { requestId } = useParams();
  
  // 견적서 기본 정보
  const [estimateInfo, setEstimateInfo] = useState({
    centerName: "강남 오토 서비스",
    customerName: "김철수",
    vehicleModel: "현대 아반떼",
    vehicleYear: "2020",
    estimateValidDays: 7,
    specialNotes: ""
  });

  // 견적 항목들
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([
    {
      id: "1",
      name: "수리 항목",
      quantity: 1,
      unit: "개",
      unitPrice: 150000,
      grade: "중급"
    },
    {
      id: "2", 
      name: "기타 항목 추가",
      quantity: 1,
      unit: "개",
      unitPrice: 200000,
      grade: "상급"
    }
  ]);

  const addEstimateItem = () => {
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "개",
      unitPrice: 0,
      grade: "중급"
    };
    setEstimateItems([...estimateItems, newItem]);
  };

  const removeEstimateItem = (id: string) => {
    setEstimateItems(estimateItems.filter(item => item.id !== id));
  };

  const updateEstimateItem = (id: string, field: keyof EstimateItem, value: any) => {
    setEstimateItems(estimateItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return estimateItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleSaveEstimate = () => {
    console.log("견적서 저장:", { estimateInfo, estimateItems });
    alert("견적서가 저장되었습니다.");
  };

  const handleSendEstimate = () => {
    console.log("견적서 발송:", { estimateInfo, estimateItems });
    alert("견적서가 고객에게 발송되었습니다.");
  };

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 페이지 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">견적서 작성</h1>
            <p className="text-muted-foreground">요청번호: {requestId || "REQ001"}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveEstimate}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button onClick={handleSendEstimate}>
              <Send className="h-4 w-4 mr-2" />
              발송
            </Button>
          </div>
        </div>

        {/* 견적서 양식 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">{estimateInfo.centerName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 차량 정보 */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label className="text-sm font-medium">차량 제조사</Label>
                <p className="text-sm">{estimateInfo.vehicleModel.split(' ')[0]}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">차량 모델</Label>
                <p className="text-sm">{estimateInfo.vehicleModel.split(' ')[1]}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">차량 모델</Label>
                <p className="text-sm">{estimateInfo.vehicleModel}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">차량 연식</Label>
                <p className="text-sm">{estimateInfo.vehicleYear}</p>
              </div>
            </div>

            {/* 견적 상세 */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">견적 상세</Label>
              
              {/* 견적 항목 테이블 헤더 */}
              <div className="grid grid-cols-7 gap-2 p-3 bg-muted font-medium text-sm">
                <div>수리 항목</div>
                <div>예상 금액</div>
                <div>소요 시간</div>
                <div>등급</div>
                <div>수량</div>
                <div>단위</div>
                <div>작업</div>
              </div>

              {/* 견적 항목들 */}
              {estimateItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-7 gap-2 p-3 border-b items-center">
                  <Input
                    placeholder="수리 항목"
                    value={item.name}
                    onChange={(e) => updateEstimateItem(item.id, 'name', e.target.value)}
                    className="h-8"
                  />
                  <Input
                    type="number"
                    placeholder="금액"
                    value={item.unitPrice}
                    onChange={(e) => updateEstimateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                  <Input
                    placeholder="시간"
                    className="h-8"
                  />
                  <Select 
                    value={item.grade} 
                    onValueChange={(value) => updateEstimateItem(item.id, 'grade', value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="상급">상급</SelectItem>
                      <SelectItem value="중급">중급</SelectItem>
                      <SelectItem value="하급">하급</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateEstimateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="h-8"
                    min="1"
                  />
                  <Input
                    value={item.unit}
                    onChange={(e) => updateEstimateItem(item.id, 'unit', e.target.value)}
                    className="h-8"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeEstimateItem(item.id)}
                    disabled={estimateItems.length <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* 항목 추가 버튼 */}
              <div className="p-3">
                <Button variant="outline" onClick={addEstimateItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  항목 추가
                </Button>
              </div>

              {/* 총액 */}
              <div className="grid grid-cols-7 gap-2 p-3 bg-muted font-bold">
                <div className="col-span-4">합계</div>
                <div className="text-green-600 text-lg col-span-3">
                  총 금액 = {formatPrice(calculateTotal())}원
                </div>
              </div>
            </div>

            {/* 견적 유효 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validDays">견적 유효 기간</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="validDays"
                    type="number"
                    value={estimateInfo.estimateValidDays}
                    onChange={(e) => setEstimateInfo(prev => ({ 
                      ...prev, 
                      estimateValidDays: parseInt(e.target.value) || 7 
                    }))}
                    className="w-20"
                    min="1"
                  />
                  <span>일</span>
                </div>
              </div>
            </div>

            {/* 특이사항 */}
            <div>
              <Label htmlFor="specialNotes">특이사항</Label>
              <Textarea
                id="specialNotes"
                placeholder="특이사항을 입력하세요"
                value={estimateInfo.specialNotes}
                onChange={(e) => setEstimateInfo(prev => ({ 
                  ...prev, 
                  specialNotes: e.target.value 
                }))}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* 연락처 정보 */}
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>연락처: 031-123-456</p>
              <p>카센터명: {estimateInfo.centerName}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}