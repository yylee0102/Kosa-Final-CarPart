import { Search, Bell, MessageCircle, Menu, ArrowLeft, User, LogIn } from "lucide-react";
import { useState, useEffect } from "react"; // useEffect import 추가
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import AuthModal from "@/shared/modals/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImage from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// ==================== 알림 기능 추가 부분 ====================

// 1. 알림 데이터 타입을 정의합니다. (백엔드 DTO와 일치)
export interface NotificationResDTO {
  id: number;
  message: string;
  isRead: boolean;
  url: string | null;
  createTime: string;
}

// 2. 알림 API 서비스 로직을 이 파일 안에 직접 정의합니다.
const API_BASE_URL = '/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const notificationApi = {
  subscribe: (): EventSource => {
    // SSE는 일반 fetch와 다르므로 EventSource API를 직접 사용합니다.
    return new EventSource(`${API_BASE_URL}/notifications/subscribe`);
  },
  getMyNotifications: async (): Promise<NotificationResDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('알림 목록 조회 실패');
    return response.json();
  },
  getUnreadCount: async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('안 읽은 알림 개수 조회 실패');
    const countText = await response.text();
    return parseInt(countText, 10);
  },
  markAsRead: async (notificationId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('알림 읽음 처리 실패');
  },
};

// ==========================================================

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth(); // updateUser는 사용되지 않으므로 제거
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const showBackButton = location.pathname !== "/";

  // 3. 알림 데이터를 저장할 상태를 만듭니다.
  const [notifications, setNotifications] = useState<NotificationResDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 4. 로그인 시 API 호출 및 실시간 알림 구독 로직
    useEffect(() => {
    if (!isLoggedIn) return;

    const fetchInitialData = async () => {
      try {
        const [notifs, count] = await Promise.all([
          notificationApi.getMyNotifications(),
          notificationApi.getUnreadCount(),
        ]);
        setNotifications(notifs);
        setUnreadCount(count);
      } catch (error) {
        console.error("초기 알림 데이터 로딩 실패:", error);
      }
    };


    fetchInitialData();

    const eventSource = notificationApi.subscribe();
    eventSource.addEventListener('notification', (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      eventSource.close();
    };

    // 컴포넌트가 사라지거나 로그아웃 시 SSE 연결을 반드시 종료해야 합니다.
    return () => {
      eventSource.close();
    };
  }, [isLoggedIn]);

  const handleNotificationClick = async (notif: NotificationResDTO) => {
      console.log("--- 알림 클릭됨 ---");
  console.log("전체 알림 데이터:", notif);
  console.log("이동할 URL:", notif.url);
    if (!notif.isRead) {
      try {
        await notificationApi.markAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }
    if (notif.url) {
      navigate(notif.url);
    }
  };

  const handleBack = () => navigate(-1);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?type=parts&q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-outline-variant bg-surface shadow-elevation-1 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 좌측: 로고 + 뒤로가기 (기존과 동일) */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={handleBack} aria-label="뒤로가기">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-3">
              <img src={logoImage} alt="CAR PARTER 로고" className="h-10 w-auto" />
              <span className="text-xl font-bold text-primary">carparter</span>
            </Link>
          </div>

          {/* 중앙: 검색바 (기존과 동일) */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <Input type="text" placeholder="찾으시는 부품을 검색하세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-surface-container pr-12" />
                <Button type="submit" size="sm" className="absolute right-1 top-1 h-8 w-8 p-0 bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* 우측: 아이콘 메뉴 */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="md:hidden"><Search className="h-5 w-5" /></Button>

            {/* 5. 알림 및 채팅 아이콘은 로그인 시에만 보이도록 수정 */}
            {isLoggedIn && (
              <>
                {/* 알림 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-surface">
                    <DropdownMenuLabel>알림</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.slice(0, 7).map((notif) => ( // 최신 7개만 보여주기 (수정)
                        <DropdownMenuItem key={notif.id} onClick={() => handleNotificationClick(notif)} className={`cursor-pointer ${!notif.isRead ? "font-bold" : ""}`}>
                          <div className="flex flex-col">
                            <span>{notif.message}</span>
                            <span className="text-xs text-muted-foreground">{/* 시간 표시 (예: 5분 전) */}</span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>새로운 알림이 없습니다.</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* 채팅 */}
                <Button variant="ghost" size="sm" onClick={() => navigate("/chat")}>
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* 프로필/로그인 드롭다운 (기존과 동일) */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user?.userType !== "USER" && (
                      <span className="hidden md:inline text-sm">{user?.name}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-surface border-outline-variant">
                  {user?.userType !== "ADMIN" && (
                    <DropdownMenuItem onClick={() => {
                      if (user?.userType === "USER") navigate("/mypage");
                      else if (user?.userType === "CAR_CENTER") navigate("/center/mypage");
                    }}>
                      마이페이지
                    </DropdownMenuItem>
                  )}
                  {user?.userType === "CAR_CENTER" && (
                    <DropdownMenuItem onClick={() => navigate("/center/estimates#sent")}>
                      견적 관리
                    </DropdownMenuItem>
                  )}
                  {user?.userType === "ADMIN" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      관리자 페이지
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)} className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                <span className="hidden md:inline">로그인</span>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}

