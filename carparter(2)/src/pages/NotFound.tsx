import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        {/* 404 아이콘 */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-on-surface mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        
        <p className="text-lg text-on-surface-variant mb-8">
          요청하신 페이지가 존재하지 않거나<br />
          잘못된 주소입니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              홈으로 가기
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전 페이지
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/wb">
              <Search className="h-4 w-4 mr-2" />
              부품 찾기
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-on-surface-variant mt-8">
          문제가 지속되면 <Link to="/support" className="text-primary hover:underline">고객센터</Link>로 문의해주세요.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
