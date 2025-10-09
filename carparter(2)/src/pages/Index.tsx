// 이 파일은 더 이상 사용되지 않습니다. HomePage.tsx로 대체되었습니다.
// 라우팅에서 제거되었으므로 삭제해도 됩니다.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // HomePage로 리다이렉트
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};
