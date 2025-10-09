// src/services/chatbot.api.ts

const API_BASE_URL = 'http://localhost:8000'; // FastAPI 서버 주소

interface ChatbotRequest {
  message: string;
}

interface ChatbotResponse {
  reply: string;
}

class ChatbotApiService {
  async sendMessageToBot(request: ChatbotRequest): Promise<ChatbotResponse> {
    const response = await fetch(`${API_BASE_URL}/chatbot/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('챗봇 응답에 실패했습니다.');
    }
    return response.json();
  }
}

export default new ChatbotApiService();