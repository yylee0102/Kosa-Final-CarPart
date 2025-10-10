# app/services/chatbot_service.py

import os
from dotenv import load_dotenv
from app.models.chatbot import ChatbotQuery, ChatHistory

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
        
        # ✅ [수정] 대화 요약을 위한 프롬프트를 훨씬 더 구체적으로 변경
        self.summary_prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "당신은 사용자를 대신하여 카센터에 제출할 '수리 요청서'를 작성하는 전문 어시스턴트입니다. "
             "아래의 사용자와 챗봇의 대화 내용을 바탕으로, 정비사가 한눈에 문제를 파악할 수 있도록 핵심 내용을 정리하여 수리 요청서를 작성해 주세요. "
             "인사말이나 불필요한 대화는 모두 제외하고, 차량 문제에 대한 내용만 명확하게 전달해야 합니다. "
             "아래와 같은 형식으로 정리해주세요:\n\n"
             "**1. 주요 증상:**\n"
             "- (여기에 주요 증상을 항목별로 정리)\n\n"
             "**2. 문제 발생 시점 / 상황:**\n"
             "- (언제, 어떤 상황에서 문제가 발생하는지 정리)\n\n"
             "**3. 고객 요청 사항:**\n"
             "- (채팅에서 언급된 사용자의 특별 요청 사항 정리, 없을 경우 생략 가능)"),
            ("user", "---대화 내용 시작---\n{conversation_text}\n---대화 내용 끝---")
        ])


        # 결과를 문자열 형태로 깔끔하게 파싱하는 도구입니다.
        self.output_parser = StrOutputParser()
        
        # ✅ [추가] 대화 요약을 위한 새로운 LangChain 체인
        self.summary_chain = self.summary_prompt | self.llm | self.output_parser

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
        
# ✅ [추가] 대화 내용을 요약하는 새로운 메서드
    def summarize_conversation(self, history: ChatHistory) -> str:
        """
        채팅 내역을 받아 LangChain 체인을 통해 요약본을 생성합니다.
        """
        try:
            # 1. 채팅 내역을 하나의 긴 텍스트로 변환합니다.
            conversation_text = "\n".join(
                f"{msg.type}: {msg.message}" for msg in history.messages
            )
            
            # 2. 요약 체인을 실행하여 결과를 얻습니다.
            summary = self.summary_chain.invoke({"conversation_text": conversation_text})
            return summary
        except Exception as e:
            print(f"Error during summary invocation: {e}")
            return "죄송합니다, 대화 내용을 요약하는 중에 오류가 발생했습니다."

# 싱글톤 인스턴스로 생성
chatbot_service = ChatbotService()