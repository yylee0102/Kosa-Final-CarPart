// 로그인 보호 컴포넌트 (ProtectedRoute)
// 이 컴포넌트는 로그인하지 않은 사용자가 보호된 페이지에 접근할 때 로그인 모달을 표시합니다.
// 사용법: 보호가 필요한 페이지를 이 컴포넌트로 감싸면 됩니다.
// 예: <ProtectedRoute><MyPage /></ProtectedRoute>

import { ReactNode, useState } from "react";
import { useAuth } from "@/shared/contexts/AuthContext";
import AuthModal from "@/shared/modals/AuthModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: ("USER" | "CAR_CENTER" | "ADMIN")[];
  fallbackMessage?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedUserTypes,
  fallbackMessage = "이 페이지에 접근하려면 로그인이 필요합니다." 
}: ProtectedRouteProps) {
  const { user, isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 로그인하지 않은 경우
  if (!isLoggedIn || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">로그인 필요</h2>
            <p className="text-muted-foreground mb-6">{fallbackMessage}</p>
            <Button onClick={() => setShowAuthModal(true)} className="w-full">
              로그인하기
            </Button>
          </CardContent>
        </Card>
        
        <AuthModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  // 사용자 타입 제한이 있는 경우 검증
  if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">접근 권한 없음</h2>
            <p className="text-muted-foreground">
              이 페이지는 {allowedUserTypes.join(", ")} 사용자만 접근할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로그인되어 있고 권한이 있는 경우 페이지 렌더링
  return <>{children}</>;
}