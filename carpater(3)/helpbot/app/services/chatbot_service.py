# app/services/chatbot_service.py

import os
from dotenv import load_dotenv
from app.models.chatbot import ChatbotQuery

# LangChain 관련 모듈 import
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# .env 파일에서 환경 변수를 불러옵니다.
load_dotenv()

class ChatbotService:
    def __init__(self):
        # OpenAI의 LLM(초거대 언어 모델)을 초기화합니다.
        self.llm = ChatOpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            model_name="gpt-4o" # 원하는 모델 선택
        )
        
        # LLM에게 어떤 역할을 부여할지 정의하는 프롬프트 템플릿입니다.
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant for the 'CAR PARTER' service, specializing in used car parts. Your name is 'Helpbot'. Answer questions concisely and friendly in Korean."),
            ("user", "{question}")
        ])
        
        # 결과를 문자열 형태로 깔끔하게 파싱하는 도구입니다.
        self.output_parser = StrOutputParser()
        
        # LangChain의 핵심 요소들을 파이프라인처럼 연결합니다. (LCEL)
        self.chain = self.prompt | self.llm | self.output_parser

    def get_reply(self, query: ChatbotQuery) -> str:
        """
        사용자의 메시지를 받아 LangChain 체인을 통해 챗봇의 답변을 생성합니다.
        """
        try:
            # LangChain 체인을 실행하여 답변을 얻습니다.
            response = self.chain.invoke({"question": query.message})
            return response
        except Exception as e:
            print(f"Error during LangChain invocation: {e}")
            return "죄송합니다, 답변을 생성하는 중에 오류가 발생했습니다."

# 싱글톤 인스턴스로 생성
chatbot_service = ChatbotService()