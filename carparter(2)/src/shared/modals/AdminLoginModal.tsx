/**
 * 관리자 로그인 모달
 * 
 * 이 모달의 역할:
 * - 관리자 전용 로그인 인터페이스 제공
 * - 별도의 관리자 인증 시스템 연결
 * - 관리자 대시보드 접근 권한 관리
 * 
 * 왜 필요한가:
 * - 일반 사용자와 관리자 로그인을 분리하여 보안 강화
 * - 관리자만의 별도 인증 플로우 제공
 * - 관리자 권한 검증 및 토큰 관리
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";
import authApiService from "@/services/auth.api";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        title: "입력 오류",
        description: "사용자명과 비밀번호를 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 개발 단계에서는 임시 관리자 로그인 허용
      if (formData.username === "admin" && formData.password === "admin") {
        const tempAdminUser = {
          id: "admin1",
          name: "관리자",
          userType: "관리자" as const,
          isLoggedIn: true
        };
        
        login(tempAdminUser);
        localStorage.setItem('authToken', 'Bearer temp-admin-token');
        
        toast({
          title: "임시 관리자 로그인",
          description: "개발용 관리자 계정으로 로그인되었습니다."
        });
        
        onClose();
        setFormData({ username: "", password: "" });
        return;
      }

      // 실제 API 호출 - 통합 로그인 사용
      const response = await authApiService.login({
        username: formData.username,
        password: formData.password
      });

      // JWT 토큰은 이미 authApiService.login에서 localStorage에 저장됨

      // 백엔드에서 받은 역할(role)을 기반으로 사용자 타입 결정
      let userType: "개인" | "카센터" | "관리자" = "관리자";
      if (response.role === "ROLE_ADMIN") {
        userType = "관리자";
      }

      const adminUser = {
        id: response.userId,
        name: response.name,
        userType,
        role: response.role,
        isLoggedIn: true
      };

      login(adminUser);

      toast({
        title: "로그인 성공",
        description: "관리자 페이지에 오신 것을 환영합니다."
      });

      // 관리자 페이지로 리디렉션
      window.location.href = '/admin';

      onClose();
      setFormData({ username: "", password: "" });

    } catch (error) {
      console.error("관리자 로그인 실패:", error);
      toast({
        title: "로그인 실패",
        description: "사용자명 또는 비밀번호가 올바르지 않습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: "", password: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            관리자 로그인
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="관리자 사용자명을 입력하세요"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
            <strong>개발용 계정:</strong> admin / admin
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  로그인 중...
                </>
              ) : (
                "로그인"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}