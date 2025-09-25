/**
 * 마이페이지 라우터
 * 
 * 사용자 타입에 따라 적절한 마이페이지로 리디렉션하는 페이지입니다.
 * - 일반 사용자: UserMyPage
 * - 카센터: CenterMyPage  
 * - 관리자: AdminDashboard
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import UserMyPage from "./UserMyPage";

export default function MyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate("/");
      return;
    }

    // 사용자 타입에 따른 리디렉션
    if (user.userType === "카센터") {
      navigate("/center/mypage");
    } else if (user.userType === "관리자") {
      navigate("/admin");
    }
    // 일반 사용자는 현재 페이지에서 UserMyPage 컴포넌트 렌더링
  }, [user, navigate]);

  if (!user?.isLoggedIn) {
    return null;
  }

  if (user.userType === "개인") {
    return <UserMyPage />;
  }

  return null;
}
