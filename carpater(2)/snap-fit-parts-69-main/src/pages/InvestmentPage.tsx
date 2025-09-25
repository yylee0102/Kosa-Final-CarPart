import { Banknote, TrendingUp, DollarSign, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvestmentPage() {
  const copyAccountNumber = () => {
    navigator.clipboard.writeText("3333179856110");
    // You could add a toast here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/5">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="container mx-auto relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
                💰 역사상 최고의 투자 기회! 💰
              </h1>
              <p className="text-3xl font-bold text-on-surface animate-fade-in animation-delay-200">
                🚀 우주를 뛰어넘는 수익률 보장! 🚀
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-scale-in"></div>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-8 rounded-3xl shadow-2xl animate-pulse">
              <h2 className="text-4xl font-black mb-4">⚡ 지금 투자하면 ⚡</h2>
              <p className="text-2xl font-bold">🔥 10배 수익 완전 보장! 🔥</p>
              <p className="text-xl font-semibold mt-2">💎 다이아몬드보다 확실한 투자! 💎</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            🌟 투자하면 얻는 혜택들 🌟
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-green-400/20 to-emerald-500/20 border-2 border-green-400 hover:scale-105 transition-transform">
              <CardHeader>
                <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-center">💹 무한 수익률</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-green-600 mb-2">🚀 1000% 보장!</p>
                <p className="text-on-surface-variant">
                  월 수익률 100% 이상!<br/>
                  연 수익률 1200% 완전 보장!<br/>
                  🏆 업계 최고 수익률!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400/20 to-cyan-500/20 border-2 border-blue-400 hover:scale-105 transition-transform">
              <CardHeader>
                <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-center">🛡️ 100% 안전</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-blue-600 mb-2">💎 원금 보장!</p>
                <p className="text-on-surface-variant">
                  손실 위험 0%!<br/>
                  정부 보증 투자!<br/>
                  🔒 완전 무위험 투자!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-2 border-purple-400 hover:scale-105 transition-transform">
              <CardHeader>
                <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <CardTitle className="text-2xl text-center">👑 VIP 혜택</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-purple-600 mb-2">🎁 특별 혜택!</p>
                <p className="text-on-surface-variant">
                  투자자만의 특권!<br/>
                  최고급 서비스!<br/>
                  🌟 평생 VIP 대우!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">🗣️ 투자자 후기 🗣️</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-surface rounded-2xl p-8 shadow-xl border-2 border-yellow-400">
              <p className="text-xl font-bold text-center mb-4">⭐⭐⭐⭐⭐</p>
              <p className="text-lg text-on-surface-variant text-center">
                "💰 한 달 만에 집 샀어요! 🏠<br/>
                정말 대박 투자입니다!<br/>
                🚗 벤츠도 현금으로 샀어요!"
              </p>
              <p className="text-center mt-4 font-semibold">- 김○○님 (서울)</p>
            </div>

            <div className="bg-surface rounded-2xl p-8 shadow-xl border-2 border-green-400">
              <p className="text-xl font-bold text-center mb-4">⭐⭐⭐⭐⭐</p>
              <p className="text-lg text-on-surface-variant text-center">
                "🎉 인생 역전했어요!<br/>
                빚쟁이에서 억대 부자로!<br/>
                💎 이제 매일이 행복해요!"
              </p>
              <p className="text-center mt-4 font-semibold">- 이○○님 (부산)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            💳 투자 방법 (초간단!) 💳
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-3xl text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-6">🏦 카카오뱅크 입금 🏦</h3>
              
              <div className="bg-white/20 rounded-2xl p-6 mb-6">
                <p className="text-2xl font-bold mb-4">💳 계좌번호</p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-3xl font-mono font-black">3333179856110</span>
                  <Button 
                    onClick={copyAccountNumber}
                    variant="secondary" 
                    className="bg-white text-primary hover:bg-gray-100"
                  >
                    📋 복사
                  </Button>
                </div>
                <p className="text-lg mt-4">예금주: CAR PARTER</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4 text-xl">
                  <span>1️⃣</span>
                  <span>위 계좌로 입금</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xl">
                  <span>2️⃣</span>
                  <span>입금 확인 즉시 투자 시작</span>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xl">
                  <span>3️⃣</span>
                  <span>매월 수익금 자동 지급</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-2xl text-white animate-pulse">
              <p className="text-2xl font-bold">⚠️ 한정 특가 이벤트! ⚠️</p>
              <p className="text-xl mt-2">🔥 지금 투자하면 보너스 20% 추가! 🔥</p>
              <p className="text-lg mt-2">⏰ 오늘까지만 특가!</p>
            </div>

            <Button 
              className="w-full py-6 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 shadow-2xl animate-bounce"
            >
              💰 지금 즉시 투자하기! 💰
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">📞 투자 문의 📞</h2>
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-xl">📱 전화: 1588-0000</p>
            <p className="text-xl">📧 이메일: invest@carparter.co.kr</p>
            <p className="text-lg text-on-surface-variant">💬 24시간 상담 가능!</p>
          </div>
        </div>
      </section>
    </div>
  );
}