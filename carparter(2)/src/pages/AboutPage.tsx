import { Building2, TrendingUp, Users, Award, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import koreanFlag from "@/assets/korean-flag.jpg";
import logoImage from "@/assets/logo.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={logoImage} 
                    alt="CAR PARTER 로고" 
                    className="h-16 w-auto"
                  />
                </div>
                <p className="text-2xl text-on-surface-variant font-light">
                  대한민국을 대표하는 혁신 기업
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>
              
              <p className="text-lg text-on-surface-variant leading-relaxed">
                테슬라와 애플을 뛰어넘는 비전으로, 자동차 부품 거래의 새로운 패러다임을 제시하며 
                대한민국의 기술력과 혁신 정신을 세계에 알리고 있습니다.
              </p>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-12 rounded overflow-hidden shadow-lg">
                  <img 
                    src={koreanFlag} 
                    alt="대한민국 태극기" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-primary font-semibold text-lg">Made in Korea 🇰🇷</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-96 h-96 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-secondary to-primary rounded-full opacity-30 animate-pulse animation-delay-1000"></div>
                <div className="absolute inset-8 bg-surface rounded-full shadow-2xl flex items-center justify-center">
                  <Building2 className="w-32 h-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 px-4 bg-surface-container">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-surface mb-4">경영진</h2>
            <p className="text-xl text-on-surface-variant">혁신을 이끄는 리더십</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">박성우</h3>
              <p className="text-primary font-semibold mb-4">공동 대표이사</p>
              <p className="text-on-surface-variant">
                글로벌 시장을 향한 비전과 혁신적 사고로 회사를 이끌어가는 리더
              </p>
            </div>

            <div className="text-center group">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">이윤열</h3>
              <p className="text-primary font-semibold mb-4">공동 대표이사</p>
              <p className="text-on-surface-variant">
                기술 혁신과 운영 효율성을 통해 회사의 성장을 견인하는 전략가
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-on-surface mb-4">놀라운 성과</h2>
            <p className="text-xl text-on-surface-variant">대한민국이 자랑하는 글로벌 기업</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-on-surface mb-2">1조 3,000억 달러</h3>
              <p className="text-primary font-semibold mb-2">연간 매출</p>
              <p className="text-on-surface-variant">전 세계를 놀라게 한 경이로운 성과</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-on-surface mb-2">50+</h3>
              <p className="text-primary font-semibold mb-2">진출 국가</p>
              <p className="text-on-surface-variant">글로벌 시장을 선도하는 기업</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-on-surface mb-2">#1</h3>
              <p className="text-primary font-semibold mb-2">업계 선두</p>
              <p className="text-on-surface-variant">혁신과 품질로 인정받는 리더</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-on-surface mb-8">우리의 비전</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-xl text-on-surface-variant leading-relaxed">
              CAR PARTER는 단순한 자동차 부품 거래 플랫폼을 넘어서, 
              전 세계 자동차 산업의 디지털 혁신을 이끄는 글로벌 기업입니다.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-surface rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-primary mb-4">애국 정신</h3>
                <p className="text-on-surface-variant">
                  대한민국의 우수한 기술력과 혁신 정신을 바탕으로 
                  세계 시장에서 대한민국의 위상을 높이고 있습니다.
                </p>
              </div>
              
              <div className="bg-surface rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-primary mb-4">애사 정신</h3>
                <p className="text-on-surface-variant">
                  회사와 직원이 하나 되어 공동의 목표를 향해 나아가며, 
                  함께 성장하고 발전하는 기업 문화를 만들어가고 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-16 p-8 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white">
              <h3 className="text-3xl font-bold mb-4">테슬라와 애플을 뛰어넘는 혁신</h3>
              <p className="text-xl opacity-90">
                기존의 패러다임을 뛰어넘는 혁신적 기술과 서비스로 
                자동차 부품 산업의 새로운 기준을 제시합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-surface-container">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-on-surface mb-8">함께 성장해요</h2>
          <p className="text-xl text-on-surface-variant mb-12">
            대한민국을 대표하는 글로벌 기업과 함께하세요
          </p>
          
          <div className="flex justify-center space-x-6">
            <Button 
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              onClick={() => window.location.href = '/investment'}
            >
              투자 문의
            </Button>
            <Button 
              className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all"
              onClick={() => window.location.href = '/careers'}
            >
              채용 정보
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}