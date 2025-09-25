from pydantic import BaseModel

class ChatbotQuery(BaseModel):
    """사용자 질문 DTO"""
    message: str

class ChatbotResponse(BaseModel):
    """챗봇 답변 DTO"""
    reply: str