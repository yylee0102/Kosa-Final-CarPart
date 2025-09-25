from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import chatbot
from app.core.config import settings

app = FastAPI(
    title="Helpbot API",
    description="CAR PARTER AI 챗봇 서비스 (Helpbot)",
    version="1.0.0"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 포함
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Helpbot API에 오신 것을 환영합니다."}