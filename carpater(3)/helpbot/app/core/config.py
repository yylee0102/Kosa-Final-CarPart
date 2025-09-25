# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]
    # 👇 이 줄을 추가해주세요.
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()