import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import * as S from '../../css/CarCenterDashboardStyle.jsx';
import apiClient from '../commons/apiClient.jsx';

const EditCarCenterModal = ({ show, onHide, onSubmit }) => {
  const [textData, setTextData] = useState({ centerName: '', address: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      // 모달이 열릴 때 기존 정보를 불러오는 로직 (API 연동)
      const fetchMyInfo = async () => {
        try {
          const response = await apiClient.get('/car-centers/my-info');
          setTextData(response.data);
        } catch (error) {
          console.error("내 정보 조회 실패:", error);
          // 실패 시 임시 데이터
          setTextData({
            centerName: '스피드메이트 강남점',
            address: '서울시 강남구 테헤란로 123',
            description: '20년 경력의 베테랑 정비사가 운영하는 믿을 수 있는 카센터입니다.'
          });
        }
      };
      fetchMyInfo();
      setSelectedFiles(null);
      setErrors({});
    }
  }, [show]);

  const handleChange = (e) => {
    setTextData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!textData.centerName.trim()) newErrors.centerName = '카센터 이름은 필수 항목입니다.';
    if (!textData.address.trim()) newErrors.address = '주소는 필수 항목입니다.';
    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // 백엔드로 보낼 FormData 객체 생성
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(textData)], { type: "application/json" }));

    if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }
    }
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>카센터 정보 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group className="mb-3">
            <Form.Label>카센터 이름</Form.Label>
            <Form.Control type="text" name="centerName" value={textData.centerName} onChange={handleChange} isInvalid={!!errors.centerName} />
            <Form.Control.Feedback type="invalid">{errors.centerName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>주소</Form.Label>
            <Form.Control type="text" name="address" value={textData.address} onChange={handleChange} isInvalid={!!errors.address} />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>한줄 소개</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={textData.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>카센터 사진</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <S.Button variant="secondary" onClick={onHide}>취소</S.Button>
        <S.Button variant="primary" onClick={handleSubmit}>저장</S.Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCarCenterModal;