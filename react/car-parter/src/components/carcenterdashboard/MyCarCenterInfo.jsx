import React, { useState } from "react";
import EditCarCenterModal from './EditCarCenterModal.jsx';
import * as S from '../../css/CarCenterDashboardStyle.jsx';
import apiClient from '../commons/apiClient.jsx';

const MyCarCenterInfo = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  // TODO: 부모 페이지(CarCenterDashboardPage)에서 정보 및 새로고침 함수를 props로 받아오는 구조로 개선하면 더 좋습니다.
  const handleInfoUpdate = async (formData) => {
    try {
        // 백엔드 컨트롤러에서 @RequestPart("request")로 DTO를 받고, @RequestPart("images")로 파일을 받아야 합니다.
        await apiClient.put('/car-centers/my-info', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("카센터 정보가 수정되었습니다.");
        setShowEditModal(false);
        // window.location.reload(); // 가장 간단한 새로고침 방법
    } catch (error) {
        console.error("정보 수정 실패:", error);
        alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <S.CardHeader>
        <h5>내 카센터 관리</h5>
        <S.Button variant="primary" size="sm" onClick={() => setShowEditModal(true)}>
          정보 수정
        </S.Button>
      </S.CardHeader>
      <p>카센터 대표사진, 한줄소개 등 고객에게 보여지는 정보를 수정할 수 있습니다.</p>
      <EditCarCenterModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSubmit={handleInfoUpdate}
      />
    </>
  );
};

export default MyCarCenterInfo;