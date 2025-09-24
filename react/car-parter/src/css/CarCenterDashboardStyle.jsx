import styled from 'styled-components';
import { Button as BootstrapButton, Table as BootstrapTable, Pagination } from 'react-bootstrap';

/* =================================
  레이아웃
  =================================
*/
export const Background = styled.div`
  min-height: 100vh;
    margin-left:460px;

`;

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TitleContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.sys.onSurface};
  display: inline-block;
`;

export const Subtitle = styled.span`
  background-color: ${({ theme }) => theme.sys.surfaceContainer};
  color: ${({ theme }) => theme.sys.onSurfaceVariant};
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  border-radius: 8px;
  margin-left: 1rem;
  vertical-align: middle;
`;

/* =================================
  카드
  =================================
*/
export const SummarySection = styled.section`
  width: 100%;
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0;
  justify-content: center;
`;

export const SummaryCard = styled.div`
  flex: 1;
  max-width: 280px;
  min-height: 140px;
  background-color: ${({ theme }) => theme.sys.surface};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
  }

  h6 {
    margin: 0;
    color: ${({ theme }) => theme.sys.onSurfaceVariant};
    font-size: 0.9rem;
    font-weight: 500;
  }

  .summary-value {
    font-size: 2.5rem;
    font-weight: 700;
    margin-top: 0.5rem;
  }

  .summary-unit {
    font-size: 1rem;
    font-weight: 500;
    margin-left: 0.5rem;
    color: ${({ theme }) => theme.sys.onSurfaceVariant};
  }
`;

export const DashboardCard = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.sys.surface};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

/* =================================
  테이블 및 버튼
  =================================
*/
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h5 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }
`;

export const Table = styled(BootstrapTable)`
  color: ${({ theme }) => theme.sys.onSurface};

  &.table-hover > tbody > tr:hover {
    background-color: ${({ theme }) => theme.sys.surfaceContainerHigh};
  }
  th { border-top: none !important; }
  td, th { border-bottom: 1px solid ${({ theme }) => theme.sys.surfaceContainerHighest}; }
`;

export const Button = styled(BootstrapButton)`
  font-weight: 500;
  border-radius: 8px;

  &.btn-primary {
    background-color: ${({ theme }) => theme.sys.primary};
    border-color: ${({ theme }) => theme.sys.primary};
    color: ${({ theme }) => theme.sys.onPrimary};

    &:hover, &:active, &:focus {
      background-color: ${({ theme }) => theme.sys.primaryContainer} !important;
      border-color: ${({ theme }) => theme.sys.primaryContainer} !important;
      color: ${({ theme }) => theme.sys.onPrimaryContainer} !important;
      box-shadow: none !important;
    }
  }

  &.btn-danger {
    background-color: ${({ theme }) => theme.sys.error};
    border-color: ${({ theme }) => theme.sys.error};
    color: ${({ theme }) => theme.sys.onError};
  }
`;

/* =================================
  페이지네이션
  =================================
*/
export const StyledPagination = styled(Pagination)`
  .page-item .page-link {
    background-color: transparent;
    border: none;
    box-shadow: none;
    color: ${({ theme }) => theme.sys.onSurfaceVariant};
    
    &:hover {
      color: ${({ theme }) => theme.sys.onSurface};
    }
  }

  .page-item.active .page-link {
    font-weight: 700;
    color: ${({ theme }) => theme.sys.primary};
  }
`;