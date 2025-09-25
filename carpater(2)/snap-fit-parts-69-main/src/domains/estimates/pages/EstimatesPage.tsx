import { FileText, Calculator, Send } from "lucide-react";
import ComingSoonPage from "@/shared/components/ComingSoonPage";

export default function EstimatesPage() {
  return (
    <ComingSoonPage
      title="견적서 작성"
      description="수리 견적을 요청하고 관리할 수 있는 서비스입니다"
      icon={<FileText className="h-16 w-16 text-tertiary" />}
    />
  );
}