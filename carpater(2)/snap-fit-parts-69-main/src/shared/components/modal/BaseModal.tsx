import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

export default function BaseModal({
  open,
  onClose,
  children,
  title,
  description,
  className = "",
  size = "md",
  showCloseButton = true,
}: BaseModalProps) {
  // 모달이 열릴 때 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      
      // 브라우저 뒤로가기 시 모달만 닫힘 (페이지 이탈 X)
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        onClose();
      };
      
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [open, onClose]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4"
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* 백드롭 */}
      <div 
        className="absolute inset-0 modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 모달 패널 */}
      <div 
        className={`
          relative w-full ${sizeClasses[size]} 
          bg-surface border border-outline-variant rounded-lg 
          shadow-modal max-h-[90vh] overflow-auto
          ${className}
        `}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-outline-variant">
            <div>
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-on-surface">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-on-surface-variant mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface"
                aria-label="모달 닫기"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
        
        {/* 컨텐츠 */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}