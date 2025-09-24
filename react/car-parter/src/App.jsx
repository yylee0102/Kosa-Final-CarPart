import React from 'react';
import { ThemeProvider } from 'styled-components';
import { themeLight } from './theme/materialTheme';
import { GlobalStyle } from './theme/GlobalStyle'; 
import CarCenterDashboardPage from './pages/CarCenterDashboardPage';
import AdminPage from './pages/AdminPage';
import CarCenterDetailPage from './pages/CarCenterDetailPage';

export default function App() {
  return (
    <ThemeProvider theme={themeLight}>
      <GlobalStyle />
      <CarCenterDetailPage />
    </ThemeProvider>
  );
}