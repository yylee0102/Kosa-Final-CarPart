import { useLocation } from "react-router-dom";
import logoImage from "@/assets/logo.png";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const location = useLocation();
  
  // 푸터 제외 페이지들: 채팅, 마이페이지(개인/사장님), 관리자
  const hideFooterPaths = ["/chat", "/mypage", "/owner", "/admin"];
  const shouldHideFooter = hideFooterPaths.some(path => 
    location.pathname.startsWith(path)
  );

  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className={`bg-surface-container border-t border-outline-variant mt-auto ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 좌측: 로고 + 저작권 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logoImage} 
                alt="CAR PARTER 로고" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-on-surface-variant">
              © 2024 CAR PARTER. All rights reserved.
            </p>
            <p className="text-xs text-on-surface-variant">
              중고차 부품의 새로운 거래 플랫폼
            </p>
          </div>

          {/* 중앙: 링크 그룹 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-on-surface mb-3">회사</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>
                  <a href="/about" className="hover:text-primary transition-colors">
                    회사소개
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-primary transition-colors">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-primary transition-colors">
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-on-surface mb-3">고객지원</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li>
                  <a href="/support" className="hover:text-primary transition-colors">
                    고객센터
                  </a>
                </li>
                <li>
                  <a href="/support/faq" className="hover:text-primary transition-colors">
                    자주묻는질문
                  </a>
                </li>
                <li>
                  <a href="/support/contact" className="hover:text-primary transition-colors">
                    1:1 문의
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 우측: 연락처 정보 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-on-surface">연락처</h3>
            <div className="space-y-2 text-sm text-on-surface-variant">
              <p>고객센터: 1588-0000</p>
              <p>평일 09:00 - 18:00</p>
              <p>주말 및 공휴일 휴무</p>
              <p>이메일: support@carparter.co.kr</p>
            </div>
            {/* SNS 링크 (향후 추가 가능) */}
            <div className="flex space-x-3 pt-2">
              {/* 
              <a href="#" className="text-on-surface-variant hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-on-surface-variant hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              */}
            </div>
          </div>
        </div>
        
        <div className="border-t border-outline-variant mt-8 pt-6 text-center text-xs text-on-surface-variant">
          <p>
            사업자등록번호: 000-00-00000 | 통신판매업신고번호: 2024-서울강남-0000 | 
            대표자: 박성우 | 주소: 서울특별시 강남구 테헤란로 000
          </p>
        </div>
      </div>
    </footer>
  );
}