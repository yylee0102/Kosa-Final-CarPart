import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function PageContainer({ 
  children, 
  className = "",
  showHeader = true,
  showFooter = true 
}: PageContainerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && <Header />}
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}