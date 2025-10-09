// 고객 관리 페이지 (임시)
import { useState } from "react";
import { User, Phone, Calendar, Search, Filter, Eye, MessageCircle, Star } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomerManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 임시 고객 데이터
  const customers = [
    {
      id: "CUST001",
      name: "김철수",
      phone: "010-1234-5678",
      email: "kim@email.com",
      vehicleInfo: "현대 아반떼 2020년",
      lastVisit: "2024.01.15",
      totalVisits: 5,
      totalSpent: 850000,
      status: "active",
      rating: 4.5,
      joinDate: "2023.03.15"
    },
    {
      id: "CUST002", 
      name: "이영희",
      phone: "010-2345-6789",
      email: "lee@email.com",
      vehicleInfo: "기아 쏘렌토 2019년",
      lastVisit: "2024.01.10",
      totalVisits: 3,
      totalSpent: 420000,
      status: "active",
      rating: 5.0,
      joinDate: "2023.08.20"
    },
    {
      id: "CUST003",
      name: "박민수", 
      phone: "010-3456-7890",
      email: "park@email.com",
      vehicleInfo: "BMW 320i 2021년",
      lastVisit: "2023.12.28",
      totalVisits: 2,
      totalSpent: 320000,
      status: "inactive",
      rating: 4.0,
      joinDate: "2023.06.10"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "vip": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "활성";
      case "inactive": return "비활성";
      case "vip": return "VIP";
      default: return "알수없음";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const filteredCustomers = customers.filter(customer => {
    if (filterStatus !== "all" && customer.status !== filterStatus) return false;
    if (searchQuery && !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !customer.phone.includes(searchQuery)) return false;
    return true;
  });

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 페이지 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">고객 관리</h1>
            <p className="text-muted-foreground">고객 정보를 확인하고 관리하세요</p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="고객명 또는 전화번호로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">총 고객</p>
                  <p className="text-2xl font-bold text-blue-600">{customers.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">활성 고객</p>
                  <p className="text-2xl font-bold text-green-600">
                    {customers.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">이번달 신규</p>
                  <p className="text-2xl font-bold text-purple-600">2</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">평균 만족도</p>
                  <p className="text-2xl font-bold text-yellow-600">4.5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 고객 목록 */}
        <div className="space-y-4">
          {filteredCustomers.map(customer => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">고객번호: {customer.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(customer.status)}>
                          {getStatusText(customer.status)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-muted-foreground">{customer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      상세보기
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      메시지
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      통화
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.vehicleInfo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>최근방문: {customer.lastVisit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">방문횟수: {customer.totalVisits}회</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">가입일: {customer.joinDate}</p>
                    <p className="text-sm">이메일: {customer.email}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">총 이용금액</p>
                    <p className="text-lg font-bold text-primary">{formatPrice(customer.totalSpent)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">이전</Button>
            <Button size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">다음</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}