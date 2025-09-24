import React, { useState, useEffect, useCallback } from 'react';
import AddReservationModal from './AddReservationModal.jsx';
import apiClient from '../commons/apiClient.jsx';
import * as S from '../../css/CarCenterDashboardStyle.jsx';
import { Form } from 'react-bootstrap';

const ReservationSection = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 서버로부터 예약 목록을 가져오는 함수
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      // 백엔드 API에 페이지네이션 파라미터를 전달합니다.
      const response = await apiClient.get('/car-centers/reservations/my', {
        params: { page: currentPage - 1, size: 5 } // Spring Pageable은 0부터 시작
      });
      // 백엔드가 Page 객체를 반환한다고 가정합니다.
      setReservations(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("예약 목록 조회 실패:", error);
      alert("예약 목록을 불러오는 데 실패했습니다.");
      // API 실패 시 보여줄 임시 데이터 (선택 사항)
      const sample = [
          { reservationId: 1, customerName: '이현우', customerPhone: '010-1234-1111', carInfo: 'GV80', reservationDate: '2025-09-18T14:00:00', requestDetails: '엔진오일 교체' },
      ];
      setReservations(sample);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // 컴포넌트가 로드되거나 페이지가 바뀔 때마다 예약 목록을 새로고침합니다.
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  // '선택 삭제' 버튼 클릭 시 실행될 함수
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return alert("삭제할 항목을 선택해주세요.");
    if (window.confirm(`${selectedIds.size}개의 예약을 정말로 삭제하시겠습니까?`)) {
      try {
        // TODO: 백엔드에 여러 ID를 한 번에 삭제하는 API가 있다면 더 효율적입니다.
        for (const id of selectedIds) {
          await apiClient.delete(`/car-centers/reservations/${id}`);
        }
        alert("선택한 예약이 삭제되었습니다.");
        setSelectedIds(new Set());
        fetchReservations(); // 목록 새로고침
      } catch (error) {
        console.error("예약 삭제 실패:", error);
        alert("예약 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  
  // 모달에서 '저장' 또는 '수정' 버튼 클릭 시 실행될 함수
  const handleReservationSubmit = async (formData) => {
    try {
      // 프론트엔드 폼 데이터(formData)를 백엔드 DTO 형식에 맞게 변환합니다.
      const reservationDTO = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        carNumber: formData.carInfo, // DTO 필드명에 맞게 수정
        reservationDate: formData.reservationDate.toISOString(), // 날짜를 ISO 문자열로 변환
        request: formData.requestDetails,
      };

      if (editingReservation) {
        // 수정 모드
        await apiClient.put(`/car-centers/reservations/${editingReservation.reservationId}`, reservationDTO);
        alert("예약이 수정되었습니다.");
      } else {
        // 추가 모드
        await apiClient.post('/car-centers/reservations', reservationDTO);
        alert("새로운 예약이 추가되었습니다.");
      }
      setShowModal(false);
      fetchReservations(); // 목록 새로고침
    } catch (error) {
      console.error("예약 저장 실패:", error);
      alert("예약 저장 중 오류가 발생했습니다.");
    }
  };

  // '예약 추가' 버튼 클릭 핸들러
  const handleAddNew = () => { setEditingReservation(null); setShowModal(true); };
  
  // 테이블 행 클릭 시 (수정 모드) 핸들러
  const handleEdit = (reservation) => { setEditingReservation(reservation); setShowModal(true); };

  // 개별 체크박스 선택/해제 핸들러
  const handleCheckboxChange = (id) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  // 헤더의 '전체 선택' 체크박스 핸들러
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allIdsOnPage = reservations.map(r => r.reservationId);
      setSelectedIds(new Set(allIdsOnPage));
    } else {
      setSelectedIds(new Set());
    }
  };

  const isAllSelectedOnPage = reservations.length > 0 && selectedIds.size === reservations.length;

  if (loading) return <div>예약 목록을 불러오는 중...</div>;

  return (
    <>
      <S.CardHeader>
        <h5>신규 예약 관리</h5>
        <div>
          <S.Button variant="danger" size="sm" className="me-2" onClick={handleDeleteSelected}>선택 삭제</S.Button>
          <S.Button variant="primary" size="sm" onClick={handleAddNew}>예약 추가</S.Button>
        </div>
      </S.CardHeader>
      <S.Table hover responsive>
        <thead>
          <tr>
            <th><Form.Check type="checkbox" checked={isAllSelectedOnPage} onChange={handleSelectAllChange} /></th>
            <th>예약자</th><th>연락처</th><th>차량정보</th><th>예약일시</th><th>요청사항</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r.reservationId} onClick={() => handleEdit(r)} style={{ cursor: 'pointer' }}>
              <td onClick={(e) => e.stopPropagation()}> 
                <Form.Check type="checkbox" checked={selectedIds.has(r.reservationId)} onChange={() => handleCheckboxChange(r.reservationId)} />
              </td>
              <td>{r.customerName}</td>
              <td>{r.customerPhone}</td>
              <td>{r.carInfo}</td>
              <td>{new Date(r.reservationDate).toLocaleString()}</td>
              <td>{r.requestDetails}</td>
            </tr>
          ))}
        </tbody>
      </S.Table>
      <div className="d-flex justify-content-center mt-3">
        <S.StyledPagination>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <S.StyledPagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
              {number}
            </S.StyledPagination.Item>
          ))}
        </S.StyledPagination>
      </div>
      <AddReservationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleReservationSubmit}
        reservationData={editingReservation}
      />
    </>
  );
};

export default ReservationSection;