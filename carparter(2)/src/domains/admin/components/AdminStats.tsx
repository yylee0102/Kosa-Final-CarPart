import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, MessageCircle, TrendingUp } from "lucide-react";

interface AdminStatsProps {
  stats: {
    users: { total: number; new: number; centers: number; };
    pendingCenters: { total: number; pending: number; approved: number; };
    notices: { total: number; active: number; };
    reports: { total: number; pending: number; resolved: number; };
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const genderData = [
    { name: '남성', value: 65, color: '#8884d8' },
    { name: '여성', value: 35, color: '#82ca9d' }
  ];

  const ageData = [
    { age: '20대', count: 45 },
    { age: '30대', count: 120 },
    { age: '40대', count: 89 },
    { age: '50대', count: 67 }
  ];

  const monthlyStats = [
    { name: '신규 사용자 등록', value: 34 },
    { name: '카센터 가입 승인', value: 15 },
    { name: '월간 거래 건수', value: 120 },
    { name: '고객 문의 응답', value: 89 }
  ];

  return (
    <div className="space-y-6">
      {/* 메인 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 사용자</p>
                <p className="text-2xl font-bold">{stats.users.total.toLocaleString()}</p>
                <p className="text-xs text-green-600">신규 +{stats.users.new}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">카센터 승인</p>
                <p className="text-2xl font-bold">{stats.pendingCenters.total.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">대기 {stats.pendingCenters.pending}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">공지사항</p>
                <p className="text-2xl font-bold">{stats.notices.total.toLocaleString()}</p>
                <p className="text-xs text-green-600">활성 {stats.notices.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">신고 건수</p>
                <p className="text-2xl font-bold">{stats.reports.total}</p>
                <p className="text-xs text-yellow-600">대기 {stats.reports.pending}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 성별 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>성별 차트</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 연령대 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>연령 차트</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 1주일간 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>1주일간 통계 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{stat.name}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}