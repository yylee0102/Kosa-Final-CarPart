from fastapi import APIRouter, Depends
from app.models.chatbot import ChatbotQuery, ChatbotResponse
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