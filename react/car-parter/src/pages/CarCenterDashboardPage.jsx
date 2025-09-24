import React, { useState, useEffect } from 'react';
import * as S from '../css/CarCenterDashboardStyle.jsx'; 
import apiClient from '../components/commons/apiClient.jsx';

import ReservationSection from '../components/carcenterdashboard/ReservationSection.jsx';
import MyCarCenterInfo from '../components/carcenterdashboard/MyCarCenterInfo.jsx';
import ReviewSection from '../components/carcenterdashboard/ReviewSection.jsx';
import SummarySection from '../components/carcenterdashboard/SummarySection.jsx';

const CarCenterDashboardPage = () => {
  const [centerName, setCenterName] = useState('로딩 중...');

  useEffect(() => {
    const fetchCarCenterName = async () => {
      try {
        const response = await apiClient.get('/car-centers/my-info'); 
        setCenterName(response.data.centerName || '내 카센터'); 
      } catch (error) {
        console.error("카센터 정보 조회 실패:", error);
        setCenterName("정보 로딩 실패");
      }
    };
    fetchCarCenterName();
  }, []);

  return (
    <S.Background>
      <S.MainContent>
        <S.TitleContainer>
          <S.Title>사장님 마이페이지</S.Title>
          <S.Subtitle>{centerName}</S.Subtitle>
        </S.TitleContainer>

        <SummarySection />
        
        <S.DashboardCard>
          <ReservationSection />
        </S.DashboardCard>
        
        <S.DashboardCard>
          <MyCarCenterInfo />
        </S.DashboardCard>

        <S.DashboardCard>
          <ReviewSection /> 
        </S.DashboardCard>
      </S.MainContent>
    </S.Background>
  );
};

export default CarCenterDashboardPage;