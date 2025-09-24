import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import * as S from '../../css/CarCenterDashboardStyle.jsx';
import apiClient from '../commons/apiClient.jsx';

const SummarySection = () => {
  const [summary, setSummary] = useState({ todayReservations: 0, newQuotes: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [todayRes] = await Promise.all([
          apiClient.get('/car-centers/today-count'),
          // TODO: 백엔드에 새로운 견적, 전체 후기 수를 가져오는 API 엔드포인트 추가 필요
        ]);
        setSummary({
          todayReservations: todayRes.data,
          newQuotes: 2, // 임시
          totalReviews: 12, // 임시
        });
      } catch (err) {
        console.error("요약 데이터 조회 실패:", err);
        setSummary({ todayReservations: 5, newQuotes: 2, totalReviews: 12 }); // 실패 시 임시 데이터
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <S.SummarySection style={{ justifyContent: 'center', alignItems: 'center', minHeight: '140px' }}>
        <Spinner animation="border" />
      </S.SummarySection>
    );
  }

  return (
    <S.SummarySection>
      <S.SummaryCard>
        <h6>오늘 예약</h6>
        <div className="summary-value">
          {summary.todayReservations}
          <span className="summary-unit">건</span>
        </div>
      </S.SummaryCard>
      <S.SummaryCard>
        <h6>새로운 견적 요청</h6>
        <div className="summary-value">
          {summary.newQuotes}
          <span className="summary-unit">건</span>
        </div>
      </S.SummaryCard>
      <S.SummaryCard>
        <h6>등록된 후기</h6>
        <div className="summary-value">
          {summary.totalReviews}
          <span className="summary-unit">개</span>
        </div>
      </S.SummaryCard>
    </S.SummarySection>
  );
};

export default SummarySection;