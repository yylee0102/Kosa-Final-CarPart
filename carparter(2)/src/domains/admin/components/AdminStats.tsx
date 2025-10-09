import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, FileText, AlertTriangle } from "lucide-react";
import { useMemo } from "react";

// 부모로부터 전달받는 데이터의 타입을 명확하게 정의합니다.
interface AdminStatsProps {
  stats: {
    users: { total: number; new: number; centers: number; };
    pendingCenters: { total: number; pending: number; approved: number; };
    notices: { total: number; active: number; };
    reports: { total: number; pending: number; resolved: number; };
    genderData: { male?: number; female?: number; }; // '?'를 추가하여 optional로 만듭니다.
    ageData: { [key: string]: number; };
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {

  // ✅ 1. 성별 데이터를 차트가 이해할 수 있는 형식으로 '안전하게' 가공합니다.
  const genderChartData = useMemo(() => {
    // stats.genderData가 없을 경우를 대비하여 기본값을 사용합니다.
    const maleCount = stats.genderData?.male || 0;
    const femaleCount = stats.genderData?.female || 0;
    return [
      { name: '남성', value: maleCount, color: '#3b82f6' },
      { name: '여성', value: femaleCount, color: '#ec4899' }
    ];
  }, [stats.genderData]);

  // ✅ 2. 연령대 데이터를 '안전하게' 가공합니다.
  const ageChartData = useMemo(() => {
    const ageOrder = ["10s", "20s", "30s", "40s", "50s", "60s+"];
    // stats.ageData가 없을 경우를 대비합니다.
    const safeAgeData = stats.ageData || {};
    return ageOrder.map(ageKey => ({
      age: `${ageKey.replace('s', '')}대`,
      count: safeAgeData[ageKey] || 0
    }));
  }, [stats.ageData]);

  return (
    <div className="space-y-6">
      {/* ==================== 메인 통계 카드 ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 사용자</p>
                <p className="text-2xl font-bold">{stats.users.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">정비소: {stats.users.centers}개</p>
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
                <p className="text-xs text-yellow-600">대기 {stats.pendingCenters.pending}건</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">공지사항</p>
                <p className="text-2xl font-bold">{stats.notices.total.toLocaleString()}</p>
                <p className="text-xs text-green-600">활성 {stats.notices.active}개</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">신고 건수</p>
                <p className="text-2xl font-bold">{stats.reports.total}</p>
                <p className="text-xs text-yellow-600">대기 {stats.reports.pending}건</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================== 차트 섹션 (가공된 데이터 사용) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>성별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={genderChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5}>
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}명`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연령대별 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}명`} />
                <Bar dataKey="count" fill="#8884d8" name="사용자 수" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}