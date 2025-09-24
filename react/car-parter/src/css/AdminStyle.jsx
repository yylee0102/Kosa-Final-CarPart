// src/css/AdminStyle.jsx
import styled, { createGlobalStyle } from 'styled-components';

/* 전역: 박스사이징 + 배경 */
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { min-height: 100%; }
  body {
    margin: 0;
    background: ${({theme}) => theme.sys.surfaceContainerHigh} 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background-attachment: fixed;
  }
`;

/* 레이아웃 */
export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px 0;            /* 좌우 0 (폭 계산에 영향 X) */
  display: flex;
  justify-content: center;
`;

export const MainContent = styled.div`
  /* 핵심: 1440을 상한으로, 그 이하에서는 100%로 줄어듦 */
  width: min(100%, 1440px);
  margin: 0 auto;
  padding-inline: 0;

  /* 1440 미만일 때만 살짝 여백 */
  @media (max-width: 1440px) {
    min-width: 800px;
    padding-inline: 16px;
  }
`;

/* 헤더 */
export const Header = styled.div`
  background: ${({theme}) => theme.sys.onSecondary};
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
`;

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme}) => theme.sys.inverseSurface};
  margin: 0;
`;

/* 카드 그리드 */
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 기본 2열 */
  gap: 24px;
  margin-bottom: 24px;

  /* 1440 미만: 1열 */
  @media (max-width: 1440px) {
    grid-template-columns: 1fr;
  }

  /* 더 좁아질 때 간격 축소 */
  @media (max-width: 640px) {
    gap: 16px;
  }
`;

export const Card = styled.div`
  background: ${({theme}) => theme.sys.onSecondary};
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  padding: 24px;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({theme}) => theme.sys.inverseSurface};
  margin: 0 0 16px 0;
`;

/* 차트 영역: 폭에 맞춰 유동 */
export const ChartContainer = styled.div`
  width: 100%;
  background: ${({theme}) => theme.sys.surface};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  /* 내부 SVG/IMG가 컨테이너 폭을 넘지 않도록 */
  svg, img { max-width: 100%; height: auto; }
`;

/* (예전 원형 데코) */
export const PieChart = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 8px solid #d1d5db;
  border-top-color: ${({theme}) => theme.sys.primaryContainer};
`;

/* 진행률 */
export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ProgressLabel = styled.span`
  font-size: 14px;
  color: ${({theme}) => theme.sys.inverseSurface};
`;

export const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${({theme}) => theme.sys.surfaceContainer};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${({theme}) => theme.sys.error} 10%;
  border-radius: 4px;
  transition: width .3s ease;
  width: ${props => props.width}%;
`;

export const ProgressValue = styled.span`
  font-size: 14px;
  color: ${({theme}) => theme.sys.inverseSurface};
  font-weight: 600;
`;

/* Pie chart + legend */
export const PieSvg = styled.svg`
  /* 부모 카드 폭이 줄어들면 함께 축소 */
  width: 100%;
  height: auto;
  max-width: 220px;

  /* 조각 색상을 테마에서 관리 */
  .slice-male   { fill: ${({theme}) => theme.sys.inversePrimary}; }
  .slice-female { fill: ${({theme}) => theme.sys.error}; } /* 원하면 tertiary로 교체 */
`;

export const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
`;

export const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: ${({ theme, $variant }) =>
    $variant === 'male' ? theme.sys.inversePrimary : theme.sys.error};
`;

export const LegendText = styled.span`
  color: ${({theme}) => theme.sys.inverseSurface};
  font-size: 14px;
`;

export const LegendValue = styled.strong`
  color: ${({theme}) => theme.sys.inverseSurface};
  margin-left: 4px;
  font-size: 14px;
`;

export const FullWidthCard = styled(Card)`
  margin-bottom: 24px;
`;

/* 통계 */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: ${({theme}) => theme.sys.inverseSurface};
  margin-bottom: 4px;
`;

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme}) => theme.sys.inverseSurface};
`;

/* 테이블 */
export const TableContainer = styled.div`
  overflow-x: auto;             /* 아주 좁으면 가로 스크롤 허용 */
`;

export const Table = styled.table`
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  table-layout: fixed;          /* 핵심: 열 폭을 고정해 더 잘 줄어들게 */
`;

export const TableHeader = styled.thead`
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 12px 8px;
  color: ${({theme}) => theme.sys.inverseSurface};
  font-weight: 600;
  white-space: nowrap;

  /* 좁아지면 헤더도 줄바꿈 허용 */
  @media (max-width: 768px) {
    white-space: normal;
    word-break: break-word;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({theme}) => theme.sys.surfaceContainer};
  &:hover { background: ${({theme}) => theme.sys.surfaceContainerHigh}; }
`;

export const TableCell = styled.td`
  padding: 12px 8px;
  color: ${({theme}) => theme.sys.inverseSurface};
  vertical-align: top;
  word-break: break-word;       /* 셀 내용도 줄어들 수 있게 */
`;

export const ContentCell = styled(TableCell)`
  /* 화면 폭에 따라 유동 */
  max-width: clamp(160px, 35vw, 320px);

  div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 아주 좁은 화면에서는 말줄임 대신 줄바꿈 허용 */
  @media (max-width: 480px) {
    div { white-space: normal; }
  }
`;

/* 상태 배지 */
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  &.active { background: ${({theme}) => theme.sys.primaryContainer};; color: ${({theme}) => theme.sys.primaryFixedDim}; }
  &.inactive { background: ${({theme}) => theme.sys.errorContainer};; color: ${({theme}) => theme.sys.inverseSurface}; }
  &.error { background: ${({theme}) => theme.sys.errorContainer}; color: ${({theme}) => theme.sys.error}; }
`;

/* 버튼 */
export const Button = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color .2s ease, color .2s ease;
  &.primary { background: ${({theme}) => theme.sys.primaryContainer}; color: ${({theme}) => theme.sys.primaryFixedDim}; }
  &.primary:hover { background: ${({theme}) => theme.sys.primary}; color: ${({theme}) => theme.sys.onSecondary};}
  &.secondary { background: ${({theme}) => theme.sys.primaryContainer}; color: ${({theme}) => theme.sys.primaryFixedDim}; }
  &.secondary:hover { background: ${({theme}) => theme.sys.onPrimaryContainer}; color: ${({theme}) => theme.sys.onSecondary};}
  &.danger { background: ${({theme}) => theme.sys.error} 50%; color: ${({theme}) => theme.sys.onPrimary}; }
  &.danger:hover { background: ${({theme}) => theme.sys.onErrorContainer} }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

/* 페이지네이션 */
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

export const PaginationButton = styled.button`
  min-width: 40px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${({theme}) => theme.sys.inversePrimary};
  color: ${({theme}) => theme.sys.inverseSurface};
  border: none;
  cursor: pointer;
  transition: all .2s ease;
  &:hover { background: ${({theme}) => theme.sys.secondary}; color: ${({theme}) => theme.sys.onSecondary}; }
  &.active { background: ${({theme}) => theme.sys.inversePrimary}; color: ${({theme}) => theme.sys.onSecondary}; }
`;

