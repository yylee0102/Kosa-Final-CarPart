import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Noto Sans KR 폰트는 index.html에서 <link> 태그로 불러옵니다. */

  *, *::before, *::after { 
    box-sizing: border-box; 
  }

  body {
    margin: 0;
    /* 👇 요청하신 대로 배경색을 #F4F6F9로 고정했습니다. */
    background-color: #F4F6F9;
    font-family: 'Noto Sans KR', sans-serif;
  }

  /* React-Bootstrap 모달 스타일 */
  .modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  .modal-header, .modal-footer {
    background-color: #f8f9fa;
    border-color: #dee2e6;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
`;