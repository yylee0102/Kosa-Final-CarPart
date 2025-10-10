from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

class ChatbotQuery(BaseModel):
    """사용자 질문 DTO"""
    message: str

class ChatbotResponse(BaseModel):
    """챗봇 답변 DTO"""
    reply: str

# ✅ [추가] React로부터 받을 개별 채팅 메시지 형식
class ChatMessage(BaseModel):
    type: str  # "user" 또는 "bot"
    message: str

# ✅ [추가] React로부터 받을 채팅 내역 전체 형식
class ChatHistory(BaseModel):
    messages: List[ChatMessage]

# ✅ [추가] React로 다시 보내줄 요약 응답 형식
class SummaryResponse(BaseModel):
    summary: str

