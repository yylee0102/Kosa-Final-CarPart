/**
 * AI 견적 채팅 상담 페이지
 * 
 * 이 페이지의 역할:
 * - AI 챗봇과의 실시간 대화를 통한 차량 문제 진단
 * - 증상 기반 예상 수리비 안내
 * - 전문 정비소 연결 서비스
 * - 24시간 언제든 이용 가능한 자동차 상담
 * 
 * 왜 필요한가:
 * - 사용자가 언제든 차량 문제를 쉽게 상담받을 수 있음
 * - 전문 지식 없이도 차량 상태를 파악할 수 있도록 도움
 * - 정비소 방문 전 미리 대략적인 견적을 알 수 있어 불안감 해소
 * - AI 기술을 활용한 차별화된 서비스로 사용자 만족도 향상
 */

// AI 견적 채팅 상담 페이지 (임시)
import { useState, useRef, useEffect } from "react";
import { Send, Plus, X } from "lucide-react";

import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
// 상단에 새로 만든 챗봇 서비스를 import 합니다.
import chatbotApiService from "@/services/chatbot.api.ts";



interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

export default function EstimateAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      message: "안녕하세요! 카봇입니다. 차가 문제가 있으신가요? 현재 차량 상황을 알려주세요~",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

    // ✅ [추가] API 호출 중 로딩 상태를 관리할 state
  const [isSummarizing, setIsSummarizing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

 const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessageContent = inputMessage.trim();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: userMessageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true); // 봇이 응답을 준비 중임을 표시합니다.
    try {
      // 새로 만든 챗봇 API 서비스를 호출합니다.
      const response = await chatbotApiService.sendMessageToBot({
        message: userMessageContent,
      });

      // FastAPI 서버로부터 받은 답변을 화면에 추가합니다.
      const botMessage: ChatMessage = {
        id: Date.now().toString() + "-bot",
        type: "bot",
        message: response.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("챗봇 API 호출 실패:", error);
      // 에러 발생 시 사용자에게 안내 메시지를 보냅니다.
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "-error",
        type: "bot",
        message: "죄송합니다. 현재 챗봇 서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false); // 봇 응답 준비가 끝났음을 표시합니다.
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // ✅ [추가] '견적요청' 버튼 클릭 시 실행될 새로운 함수
  const handleRequestEstimate = async () => {
    setIsSummarizing(true); // 로딩 시작
    try {
      // 1. FastAPI로 보낼 데이터 준비 (messages state 사용)
      //    FastAPI의 ChatHistory 모델과 형식을 맞춰줍니다.
      const chatHistory = { 
        messages: messages.map(({ type, message }) => ({ type, message }))
      };

      // 2. FastAPI 요약 API('/chatbot/summarize')를 호출합니다.
      //    (실제로는 chatbotApiService.summarize(chatHistory) 같은 함수를 만들어 호출)
      const res = await fetch('http://127.0.0.1:8000/chatbot/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatHistory),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const responseData = await res.json();
      const summaryText = responseData.summary;

      // 3. 요약된 텍스트를 state에 담아 견적요청 페이지로 이동합니다.
      navigate('/estimates/create', { 
        state: { summary: summaryText } 
      });

    } catch (error) {
      console.error("대화 요약 실패:", error);
      alert("요약 정보를 가져오는 데 실패했습니다. 직접 내용을 입력해주세요.");
      // 실패하더라도 내용은 직접 입력할 수 있도록 페이지는 이동시켜 줍니다.
      navigate('/estimates/create');
    } finally {
      setIsSummarizing(false); // 로딩 끝
    }
  };

  const quickActions = [
    "견적요청",
    "뒤로가기"
  ];

  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 채팅 헤더 */}
        <Card className="mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🚗</span>
                </div>
                <div>
                  <CardTitle className="text-lg">카봇</CardTitle>
                  <p className="text-sm text-muted-foreground">AI 자동차 진단 어시스턴트</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* 채팅 영역 */}
        <Card className="h-[500px] flex flex-col">
          <CardContent className="flex-1 p-4 overflow-hidden">
            {/* 메시지 목록 */}
            <div className="h-full overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${
                      message.type === "user" ? "text-right" : "text-left"
                    }`}>
                      {message.type === "bot" ? "카봇" : "나"} {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* 타이핑 인디케이터 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* 빠른 액션 버튼 */}
          {messages.length > 1 && (
            <div className="px-4 py-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">더 많은 옵션을 원하세요?</p>
              <div className="flex gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (action === "견적요청") {
                        // ✅ [수정] 새로 만든 API 호출 함수를 연결합니다.
                        handleRequestEstimate();
                      } else if (action === "뒤로가기") {
                        navigate(-1);
                      }
                    }}
                    // ✅ [추가] 로딩 중일 때 버튼을 비활성화하고 텍스트를 변경합니다.
                    disabled={action === "견적요청" && isSummarizing}
                  >
                    {action === "견적요청" && isSummarizing ? "요약 중..." : action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 입력 영역 */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="메시지를 입력하세요..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}