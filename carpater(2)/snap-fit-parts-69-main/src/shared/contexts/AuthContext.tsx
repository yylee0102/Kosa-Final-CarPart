import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  userType: "USER" | "CAR_CENTER" | "ADMIN";
  role?: string; // ROLE_USER, ROLE_CARCENTER, ROLE_ADMIN
  isLoggedIn: boolean;
  profileImage?: string;
  rating?: number;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAdmin: boolean;
  isCenter: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");
    
    if (savedUser && authToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("사용자 정보 파싱 실패:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken"); // JWT 토큰도 삭제
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // 역할별 helper functions
  const isAdmin = user?.userType === "ADMIN" || user?.role === "ROLE_ADMIN";
  const isCenter = user?.userType === "CAR_CENTER" || user?.role === "ROLE_CARCENTER";
  const isUser = user?.userType === "USER" || user?.role === "ROLE_USER";

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user?.isLoggedIn && !!localStorage.getItem("authToken"),
    login,
    logout,
    updateUser,
    isAdmin,
    isCenter,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}