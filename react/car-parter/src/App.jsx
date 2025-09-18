import React from 'react';
import { ThemeProvider } from 'styled-components';
import { themeDark, themeLight } from './theme/materialTheme';
import { GlobalStyle } from './css/AdminStyle'; // 기존 GlobalStyle 그대로 사용
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <ThemeProvider theme={themeLight}>
      <GlobalStyle />
      <AdminPage />
    </ThemeProvider>
  );
}
