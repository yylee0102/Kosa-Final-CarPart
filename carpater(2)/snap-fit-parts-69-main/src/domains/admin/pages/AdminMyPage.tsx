// 관리자 마이페이지 (임시)
import { useState } from "react";
import { Shield, Users, Building, FileText, BarChart3, Settings } from "lucide-react";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/shared/contexts/AuthContext";

export default function AdminMyPage() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Users, label: "사용자 관리", href: "/admin/users" },
    { icon: Building, label: "카센터 승인 관리", href: "/admin/centers" },
    { icon: FileText, label: "공지사항 관리", href: "/admin/notices" },
    { icon: BarChart3, label: "신고 관리", href: "/admin/reports" },
    { icon: BarChart3, label: "통계 관리", href: "/admin/statistics" },
    { icon: Settings, label: "시스템 설정", href: "/admin/settings" },
  ];

  const stats = [
    { label: "전체 사용자", value: "1,234명", color: "text-blue-600" },
    { label: "승인 대기 카센터", value: "8개", color: "text-orange-600" },
    { label: "신규 공지사항", value: "3건", color: "text-green-600" },
    { label: "처리 대기 신고", value: "2건", color: "text-red-600" },
  ];

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6">
        {/* 관리자 정보 카드 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">시스템 관리자</p>
                <Badge className="mt-2 bg-red-100 text-red-800">관리자</Badge>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                설정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {menuItems.map((item) => (
            <Card key={item.label} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">관리하기</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 최근 활동 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">최근 관리 활동</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span>○○카센터 승인 완료</span>
                <span className="text-sm text-muted-foreground">오늘 15:20</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>부적절한 리뷰 신고 처리 완료</span>
                <span className="text-sm text-muted-foreground">오늘 12:30</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>신규 공지사항 게시</span>
                <span className="text-sm text-muted-foreground">어제 17:00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}