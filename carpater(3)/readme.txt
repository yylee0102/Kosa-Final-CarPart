(처음 실행할 때)

# 'venv'라는 이름의 가상환경을 생성합니다.
python -m venv venv

가상환경 실행
.\venv\Scripts\activate

패키지 설치:
(가상환경이 활성화된 상태에서) 아래 명령어를 실행하세요.
pip install -r requirements.txt

모든 파일에 코드를 채워 넣었다면, 터미널에서 helpbot 최상위 폴더에 있는지 확인하고 아래 명령어로 서버를 실행합니다.
uvicorn app.main:app --reload


(이후 실행할 때)

가상환경 실행
.\venv\Scripts\activate

서버를 실행
uvicorn app.main:app --reload



