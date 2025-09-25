import PageContainer from "@/shared/components/layout/PageContainer";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ComingSoonPage({ 
  title, 
  description, 
  icon = <Construction className="h-16 w-16 text-primary" />
}: ComingSoonPageProps) {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {icon}
          </div>
          
          <h1 className="text-3xl font-bold text-on-surface mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-on-surface-variant mb-8">
            {description}
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              곧 멋진 기능으로 찾아뵙겠습니다! 🚗✨
            </p>
            
            <Button 
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}