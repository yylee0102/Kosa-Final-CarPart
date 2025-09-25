import { Briefcase, DollarSign, TrendingUp, Users, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-fade-in">
                💼 CAR PARTER 채용 정보 💼
              </h1>
              <p className="text-2xl text-on-surface-variant animate-fade-in animation-delay-200">
                🌟 꿈의 직장에서 함께할 인재를 찾습니다 🌟
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto animate-scale-in"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Requirement Notice */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-red-600 font-bold">
                  🚨 중요 공지사항 🚨
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-white/80 rounded-2xl p-8 border-2 border-red-300">
                  <h3 className="text-2xl font-bold text-red-700 mb-4">
                    💰 채용 조건 안내 💰
                  </h3>
                  <p className="text-xl text-gray-800 leading-relaxed">
                    <strong>CAR PARTER</strong>의 채용은 특별한 시스템으로 운영됩니다.<br/><br/>
                    
                    🔥 <strong className="text-red-600">투자 참여 시에만 채용 가능</strong> 🔥<br/><br/>
                    
                    💎 이유: 회사의 성장과 함께하는 진정한 파트너를 찾기 위함<br/>
                    🚀 혜택: 투자자이자 직원으로서 더블 수익 보장<br/>
                    ⭐ 특전: 일반 직원보다 10배 높은 대우
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl p-6 border border-green-400">
                    <h4 className="text-xl font-bold text-green-600 mb-3">💼 일반 채용</h4>
                    <p className="text-gray-700">
                      ❌ 현재 불가능<br/>
                      ❌ 대기자 명단만 운영<br/>
                      ❌ 채용 시기 미정
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400">
                    <h4 className="text-xl font-bold text-yellow-600 mb-3">💰 투자자 채용</h4>
                    <p className="text-gray-700">
                      ✅ 즉시 채용 가능<br/>
                      ✅ 최고 대우 보장<br/>
                      ✅ 투자 수익까지 추가
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl transform hover:scale-105 transition-all"
                  onClick={() => window.location.href = '/investment'}
                >
                  🚀 투자하고 입사하기 🚀
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Benefits */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🌟 CAR PARTER 직원 혜택 🌟
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:scale-105 transition-transform shadow-xl">
              <CardHeader>
                <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-center">💰 최고 연봉</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-green-600 mb-2">연봉 1억+</p>
                <p className="text-on-surface-variant">
                  • 업계 최고 수준 연봉<br/>
                  • 성과급 별도 지급<br/>
                  • 투자 수익 추가 보장
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform shadow-xl">
              <CardHeader>
                <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-center">⏰ 자율 근무</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-blue-600 mb-2">완전 자율</p>
                <p className="text-on-surface-variant">
                  • 출퇴근 시간 자율<br/>
                  • 재택근무 100% 지원<br/>
                  • 휴가 무제한
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform shadow-xl">
              <CardHeader>
                <Building className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-center">🏢 최고 시설</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-purple-600 mb-2">5성급 오피스</p>
                <p className="text-on-surface-variant">
                  • 강남 프리미엄 오피스<br/>
                  • 최신 장비 무제한 지원<br/>
                  • VIP 라운지 이용
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Positions */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">📋 채용 포지션 📋</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700">🔧 개발팀</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-lg mb-2">모집 분야:</h4>
                    <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
                      <li>풀스택 개발자</li>
                      <li>프론트엔드 개발자</li>
                      <li>백엔드 개발자</li>
                      <li>AI/ML 엔지니어</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">필요 조건:</h4>
                    <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
                      <li>💰 투자 참여 필수</li>
                      <li>경력 3년 이상</li>
                      <li>React, Node.js 경험</li>
                      <li>열정과 도전 정신</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">📊 비즈니스팀</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-lg mb-2">모집 분야:</h4>
                    <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
                      <li>사업개발 매니저</li>
                      <li>마케팅 전문가</li>
                      <li>영업 담당자</li>
                      <li>고객성공 매니저</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">필요 조건:</h4>
                    <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
                      <li>💰 투자 참여 필수</li>
                      <li>관련 경력 2년 이상</li>
                      <li>영어 가능자 우대</li>
                      <li>커뮤니케이션 능력</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">🚀 지금 바로 시작하세요! 🚀</h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-yellow-400">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">✨ 간편한 입사 절차 ✨</h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-center justify-center space-x-4">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <span>투자 참여 (최소 1,000만원)</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <span>서류 심사 (즉시 통과)</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <span>면접 (형식적 절차)</span>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <span>즉시 입사! 🎉</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full py-6 text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-2xl transform hover:scale-105 transition-all"
                onClick={() => window.location.href = '/investment'}
              >
                💰 투자하고 입사 지원하기 💰
              </Button>
              
              <p className="text-sm text-on-surface-variant">
                * 투자 없는 일반 채용은 현재 진행하지 않습니다.
              </p>
            </div>

            <div className="pt-8 border-t border-outline-variant">
              <h3 className="text-xl font-bold mb-4">📞 채용 문의</h3>
              <p className="text-lg">📱 전화: 1588-0000</p>
              <p className="text-lg">📧 이메일: careers@carparter.co.kr</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}