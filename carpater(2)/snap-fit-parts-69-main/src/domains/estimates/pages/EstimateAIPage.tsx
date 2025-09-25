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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let botResponse = "";
      
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("브레이크") || lowerMessage.includes("제동")) {
        botResponse = "브레이크 소음 패드 마모나 디스크 이상일 수 있습니다. 🚫 이 경우 브레이크 패드 교체나 디스크에 직접 마찰되는 정도일 수 있습니다. 가까운 정비소에서 점검을 받으시나, 저희 차량 진단 서비스를 이용해 원인을 정확히 확인해보시는 것도 좋습니다.";
      } else if (lowerMessage.includes("엔진") || lowerMessage.includes("시동")) {
        botResponse = "엔진 관련 문제시군요. 시동이 잘 안 걸리거나 소음이 나나요? 더 자세한 증상을 알려주시면 정확한 진단을 도와드릴 수 있습니다.";
      } else if (lowerMessage.includes("타이어") || lowerMessage.includes("바퀴")) {
        botResponse = "타이어 관련 문제이군요. 펑크나 마모, 또는 공기압 문제일 수 있습니다. 타이어 상태와 주행 중 느끼는 증상을 자세히 알려주세요.";
      } else if (lowerMessage.includes("범퍼") || lowerMessage.includes("외관")) {
        botResponse = "외관 손상이군요. 범퍼 손상 정도에 따라 수리나 교체가 필요할 수 있습니다. 사진을 첨부해주시면 더 정확한 견적을 드릴 수 있어요.";
      } else {
        botResponse = "더 구체적인 증상을 알려주시면 정확한 진단을 도와드릴 수 있습니다. 예를 들어, 언제부터 문제가 시작되었는지, 어떤 소리가 나는지 등을 말씀해 주세요.";
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "bot",
        message: botResponse,
        timestamp: new Date()
      }]);
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user", 
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    
    // 봇 응답 시뮬레이션
    simulateBotResponse(inputMessage);
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

  const quickActions = [
    "견적요청",
    "위도가기"
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
                        alert("견적요청 페이지로 이동합니다.");
                      } else if (action === "위도가기") {
                        alert("위치 찾기 기능을 실행합니다.");
                      }
                    }}
                  >
                    {action}
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