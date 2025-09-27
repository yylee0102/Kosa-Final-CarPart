/**
 * 통합 로그인 모달 (최종 수정본)
 * - [수정] JSX 문법 오류 수정 (버튼 내 아이콘, 텍스트 그룹화)
 * - [수정] 일반 회원가입 시 주민등록번호를 앞 6자리와 뒤 1자리까지 입력받도록 변경
 * - [추가] 카센터 등록 탭에 카카오 주소 검색 API 연동
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, UserPlus, Building, Phone, Check } from "lucide-react";
import authApiService from "@/services/auth.api";
import carCenterApiService from "@/services/carCenter.api";
import userApiService from "@/services/user.api";

import { useNavigate } from "react-router-dom";
import PhoneVerificationModal from "@/shared/modals/PhoneVerificationModal";
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [phoneVerificationOpen, setPhoneVerificationOpen] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  const [duplicateChecks, setDuplicateChecks] = useState({
    idChecked: false,
    businessNumberChecked: false,
    idAvailable: false,
    businessNumberAvailable: false
  });

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const [userJoinForm, setUserJoinForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    ssn: "",
    marketingAgreed: false
  });

  const [centerRegisterForm, setCenterRegisterForm] = useState({
    username: "", password: "", confirmPassword: "", centerName: "", businessNumber: "", address: "", phone: "", description: ""
  });

  const [centerPhoneVerified, setCenterPhoneVerified] = useState(false);
  const [centerPhoneVerificationOpen, setCenterPhoneVerificationOpen] = useState(false);
  
  const openPostcode = useDaumPostcodePopup();

  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';
    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    handleInputChange("centerRegister", "address", fullAddress);
  };

  const handleAddressSearch = () => {
    openPostcode({ onComplete: handleCompletePostcode });
  };

  const handleInputChange = (form: string, field: string, value: string | boolean) => {
    const setForm = form === "login" ? setLoginForm : form === "userJoin" ? setUserJoinForm : setCenterRegisterForm;
    setForm(prev => ({ ...prev, [field]: value }));

    if (field === "username") {
      setDuplicateChecks(prev => ({ ...prev, idChecked: false, idAvailable: false }));
    }
    if (form === "centerRegister" && field === "businessNumber") {
      setDuplicateChecks(prev => ({ ...prev, businessNumberChecked: false, businessNumberAvailable: false }));
    }
    if (form === "centerRegister" && field === "phone") {
      setCenterPhoneVerified(false);
    }
  };
  
  const handleCheckUserIdDuplicate = async () => {
    const username = userJoinForm.username;
    if (!username.trim()) {
      toast({ title: "입력 오류", description: "아이디를 입력해주세요.", variant: "destructive" });
      return;
    }
    try {
      const result = await carCenterApiService.checkDuplicate('id', username);
      setDuplicateChecks({ ...duplicateChecks, idChecked: true, idAvailable: !result.isDuplicate });
      toast({
        title: result.isDuplicate ? "중복된 아이디" : "사용 가능한 아이디",
        description: result.message,
        variant: result.isDuplicate ? "destructive" : "default"
      });
    } catch (error) {
      toast({ title: "검사 실패", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleCheckCenterIdDuplicate = async () => {
    const username = centerRegisterForm.username;
    if (!username.trim()) {
      toast({ title: "입력 오류", description: "아이디를 입력해주세요.", variant: "destructive" });
      return;
    }
    try {
      const result = await carCenterApiService.checkDuplicate('id', username);
      setDuplicateChecks({ ...duplicateChecks, idChecked: true, idAvailable: !result.isDuplicate });
      toast({
        title: result.isDuplicate ? "중복된 아이디" : "사용 가능한 아이디",
        description: result.message,
        variant: result.isDuplicate ? "destructive" : "default"
      });
    } catch (error) {
      toast({ title: "검사 실패", description: (error as Error).message, variant: "destructive" });
    }
  };
  
  const checkBusinessNumberDuplicate = async (businessNumber: string) => {
    if (!businessNumber.trim()) {
      toast({ title: "입력 오류", description: "사업자등록번호를 입력해주세요.", variant: "destructive" });
      return;
    }
    try {
      const result = await carCenterApiService.checkDuplicate('businessNumber', businessNumber);
      setDuplicateChecks(prev => ({ ...prev, businessNumberChecked: true, businessNumberAvailable: !result.isDuplicate }));
      toast({
        title: result.isDuplicate ? "중복된 사업자번호" : "사용 가능한 사업자번호",
        description: result.message,
        variant: result.isDuplicate ? "destructive" : "default"
      });
    } catch (error) {
      toast({ title: "검사 실패", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) {
      toast({ title: "입력 오류", description: "아이디와 비밀번호를 모두 입력해주세요.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await authApiService.login(loginForm);
      let userType: "USER" | "CAR_CENTER" | "ADMIN" = "USER";
      if (response.role === "ROLE_ADMIN") userType = "ADMIN";
      else if (response.role === "ROLE_CAR_CENTER") userType = "CAR_CENTER";
      
      login({ id: response.userId, name: response.name, userType, role: response.role, isLoggedIn: true });
      toast({ title: "로그인 성공", description: `${response.name}님 환영합니다.` });
      
      onClose();
      resetForms();
      
      if (userType === "ADMIN") navigate("/admin");
      else if (userType === "CAR_CENTER") navigate("/center/mypage");
      else navigate("/");
    } catch (error) {
      toast({ title: "로그인 실패", description: "아이디 또는 비밀번호가 올바르지 않습니다.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userJoinForm.password !== userJoinForm.confirmPassword) {
      toast({ title: "비밀번호 불일치", variant: "destructive" }); return;
    }
    if (!duplicateChecks.idChecked || !duplicateChecks.idAvailable) {
      toast({ title: "아이디 중복검사 필요", variant: "destructive" }); return;
    }
    if (!phoneVerified) {
      toast({ title: "전화번호 인증 필요", variant: "destructive" }); return;
    }
    setIsLoading(true);
    try {
      await authApiService.userJoin({
        userId: userJoinForm.username,
        password: userJoinForm.password,
        name: userJoinForm.name,
        phoneNumber: userJoinForm.phone,
        ssn: userJoinForm.ssn,
        marketingAgreed: userJoinForm.marketingAgreed,
      });
      toast({ title: "회원가입 완료", description: "로그인해주세요." });
      setActiveTab("login");
      resetForms();
    } catch (error) {
      toast({ title: "회원가입 실패", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCenterRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (centerRegisterForm.password !== centerRegisterForm.confirmPassword) {
      toast({ title: "비밀번호 불일치", variant: "destructive" }); return;
    }
    if (!duplicateChecks.idChecked || !duplicateChecks.idAvailable) {
      toast({ title: "아이디 중복검사 필요", variant: "destructive" }); return;
    }
    if (!duplicateChecks.businessNumberChecked || !duplicateChecks.businessNumberAvailable) {
      toast({ title: "사업자번호 중복검사 필요", variant: "destructive" }); return;
    }
    if (!centerPhoneVerified) {
      toast({ title: "전화번호 인증 필요", variant: "destructive" }); return;
    }
    setIsLoading(true);
    try {
      await carCenterApiService.register({
        centerId: centerRegisterForm.username,
        password: centerRegisterForm.password,
        centerName: centerRegisterForm.centerName,
        businessRegistrationNumber: centerRegisterForm.businessNumber,
        address: centerRegisterForm.address,
        phoneNumber: centerRegisterForm.phone,
        openingHours: '09:00-18:00',
        description: centerRegisterForm.description || undefined
      });
      toast({ title: "카센터 등록 완료", description: "승인 후 이용 가능합니다." });
      setActiveTab("login");
      resetForms();
    } catch (error) {
      toast({ title: "등록 실패", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ username: "", password: "" });
    setUserJoinForm({ username: "", password: "", confirmPassword: "", name: "", phone: "", ssn: "", marketingAgreed: false });
    setCenterRegisterForm({ username: "", password: "", confirmPassword: "", centerName: "", businessNumber: "", address: "", phone: "", description: "" });
    setPhoneVerified(false);
    setCenterPhoneVerified(false);
    setDuplicateChecks({ idChecked: false, businessNumberChecked: false, idAvailable: false, businessNumberAvailable: false });
  };

  const handleClose = () => {
    resetForms();
    setActiveTab("login");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-center">CarParter</DialogTitle></DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login" className="gap-2"><LogIn className="h-4 w-4" />로그인</TabsTrigger>
            <TabsTrigger value="userJoin" className="gap-2"><UserPlus className="h-4 w-4" />일반 회원가입</TabsTrigger>
            <TabsTrigger value="centerRegister" className="gap-2"><Building className="h-4 w-4" />카센터 등록</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">아이디</Label>
                <Input id="login-username" value={loginForm.username} onChange={(e) => handleInputChange("login", "username", e.target.value)} placeholder="아이디를 입력하세요" disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <Input id="login-password" type="password" value={loginForm.password} onChange={(e) => handleInputChange("login", "password", e.target.value)} placeholder="비밀번호를 입력하세요" disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 로그인 중...</> : "로그인"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="userJoin">
            <form onSubmit={handleUserJoin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="userJoin-username">아이디 {duplicateChecks.idChecked && (duplicateChecks.idAvailable ? <Check className="inline h-4 w-4 text-green-500 ml-1" /> : <span className="text-red-500 text-xs ml-1">사용불가</span>)}</Label>
                <div className="flex gap-2">
                  <Input id="userJoin-username" value={userJoinForm.username} onChange={(e) => handleInputChange("userJoin", "username", e.target.value)} placeholder="아이디" disabled={isLoading} />
                  <Button type="button" variant="outline" onClick={handleCheckUserIdDuplicate} disabled={!userJoinForm.username || isLoading}>중복검사</Button>
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="userJoin-name">이름</Label>
                  <Input id="userJoin-name" value={userJoinForm.name} onChange={(e) => handleInputChange("userJoin", "name", e.target.value)} placeholder="이름" disabled={isLoading} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userJoin-password">비밀번호</Label>
                  <Input id="userJoin-password" type="password" value={userJoinForm.password} onChange={(e) => handleInputChange("userJoin", "password", e.target.value)} placeholder="비밀번호" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userJoin-confirmPassword">비밀번호 확인</Label>
                  <Input id="userJoin-confirmPassword" type="password" value={userJoinForm.confirmPassword} onChange={(e) => handleInputChange("userJoin", "confirmPassword", e.target.value)} placeholder="비밀번호 확인" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userJoin-phone">전화번호 {phoneVerified && <Check className="inline h-4 w-4 text-green-500 ml-1" />}</Label>
                <div className="flex gap-2">
                  <Input id="userJoin-phone" value={userJoinForm.phone} onChange={(e) => handleInputChange("userJoin", "phone", e.target.value)} placeholder="전화번호" disabled={isLoading} />
                  <Button type="button" variant="outline" onClick={() => setPhoneVerificationOpen(true)} disabled={!userJoinForm.phone || phoneVerified || isLoading}>
                    <>
                      <Phone className="h-4 w-4 mr-1" />
                      {phoneVerified ? "인증완료" : "인증"}
                    </>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="userJoin-ssn">주민번호 앞 6자리와 뒤 1자리</Label>
                  <Input id="userJoin-ssn" value={userJoinForm.ssn} onChange={(e) => handleInputChange("userJoin", "ssn", e.target.value)} placeholder="예: 9501011" disabled={isLoading} maxLength={7} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={userJoinForm.marketingAgreed as boolean} onChange={(e) => handleInputChange("userJoin", "marketingAgreed", e.target.checked)} id="marketing-agree" className="rounded" />
                    <Label htmlFor="marketing-agree" className="text-sm font-normal">마케팅 수신 동의</Label>
                  </label>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !phoneVerified || !duplicateChecks.idAvailable}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 가입 중...</> : "회원가입"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="centerRegister">
            <form onSubmit={handleCenterRegister} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="center-username">아이디 {duplicateChecks.idChecked && (duplicateChecks.idAvailable ? <Check className="inline h-4 w-4 text-green-500 ml-1" /> : <span className="text-red-500 text-xs ml-1">사용불가</span>)}</Label>
                  <div className="flex gap-2">
                    <Input id="center-username" value={centerRegisterForm.username} onChange={(e) => handleInputChange("centerRegister", "username", e.target.value)} placeholder="아이디" disabled={isLoading} />
                    <Button type="button" variant="outline" onClick={handleCheckCenterIdDuplicate} disabled={!centerRegisterForm.username || isLoading}>중복검사</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center-centerName">카센터명</Label>
                  <Input id="center-centerName" value={centerRegisterForm.centerName} onChange={(e) => handleInputChange("centerRegister", "centerName", e.target.value)} placeholder="카센터명" disabled={isLoading} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="center-password">비밀번호</Label>
                  <Input id="center-password" type="password" value={centerRegisterForm.password} onChange={(e) => handleInputChange("centerRegister", "password", e.target.value)} placeholder="비밀번호" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="center-confirmPassword">비밀번호 확인</Label>
                  <Input id="center-confirmPassword" type="password" value={centerRegisterForm.confirmPassword} onChange={(e) => handleInputChange("centerRegister", "confirmPassword", e.target.value)} placeholder="비밀번호 확인" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="center-businessNumber">사업자등록번호 {duplicateChecks.businessNumberChecked && (duplicateChecks.businessNumberAvailable ? <Check className="inline h-4 w-4 text-green-500 ml-1" /> : <span className="text-red-500 text-xs ml-1">사용불가</span>)}</Label>
                <div className="flex gap-2">
                  <Input id="center-businessNumber" value={centerRegisterForm.businessNumber} onChange={(e) => handleInputChange("centerRegister", "businessNumber", e.target.value)} placeholder="000-00-00000" disabled={isLoading} />
                  <Button type="button" variant="outline" onClick={() => checkBusinessNumberDuplicate(centerRegisterForm.businessNumber)} disabled={!centerRegisterForm.businessNumber || isLoading}>중복검사</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="center-address">주소</Label>
                <div className="flex gap-2">
                  <Input id="center-address" value={centerRegisterForm.address} readOnly placeholder="아래 버튼을 눌러 주소를 검색하세요" disabled={isLoading}/>
                  <Button type="button" variant="outline" onClick={handleAddressSearch} disabled={isLoading}>주소 검색</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="center-phone">전화번호 {centerPhoneVerified && <Check className="inline h-4 w-4 text-green-500 ml-1" />}</Label>
                <div className="flex gap-2">
                  <Input id="center-phone" value={centerRegisterForm.phone} onChange={(e) => handleInputChange("centerRegister", "phone", e.target.value)} placeholder="전화번호" disabled={isLoading}/>
                  <Button type="button" variant="outline" onClick={() => setCenterPhoneVerificationOpen(true)} disabled={!centerRegisterForm.phone || centerPhoneVerified || isLoading}>
                    <>
                      <Phone className="h-4 w-4 mr-1" />
                      {centerPhoneVerified ? "인증완료" : "인증"}
                    </>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !duplicateChecks.idAvailable || !duplicateChecks.businessNumberAvailable || !centerPhoneVerified}>
                {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 등록 중...</> : "카센터 등록"}
              </Button>
              <div className="text-xs text-muted-foreground text-center">등록 후 관리자 승인이 필요합니다</div>
            </form>
          </TabsContent>
        </Tabs>
        <PhoneVerificationModal open={phoneVerificationOpen} onClose={() => setPhoneVerificationOpen(false)} onVerified={() => setPhoneVerified(true)} phoneNumber={userJoinForm.phone} />
        <PhoneVerificationModal open={centerPhoneVerificationOpen} onClose={() => setCenterPhoneVerificationOpen(false)} onVerified={() => setCenterPhoneVerified(true)} phoneNumber={centerRegisterForm.phone} />
      </DialogContent>
    </Dialog>
  );
}