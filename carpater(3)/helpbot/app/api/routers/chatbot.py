from fastapi import APIRouter, Depends
# ✅ [수정] 새로 만든 모델들을 import 합니다.
from app.models.chatbot import (
    ChatbotQuery, 
    ChatbotResponse, 
    ChatHistory, 
    SummaryResponse
)
from app.services.chatbot_service import ChatbotService, chatbot_service

router = APIRouter()

@router.post("/ask", response_model=ChatbotResponse)
async def ask_chatbot(
    query: ChatbotQuery,
    service: ChatbotService = Depends(lambda: chatbot_service)
):
    """
    사용자로부터 메시지를 받아 챗봇 서비스를 호출하고 답변을 반환합니다.
    """
    reply = service.get_reply(query)
    return ChatbotResponse(reply=reply)

# ✅ [추가] 대화 내용 요약 API 엔드포인트
@router.post("/summarize", response_model=SummaryResponse)
async def summarize_chat(
    history: ChatHistory,
    service: ChatbotService = Depends(lambda: chatbot_service)
):
    """
    사용자와 봇의 전체 채팅 내역을 받아 요약된 텍스트를 반환합니다.
    """
    summary = service.summarize_conversation(history)
    return SummaryResponse(summary=summary)