import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import * as S from '../../css/CarCenterDashboardStyle.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddReservationModal = ({ show, onHide, onSubmit, reservationData }) => {
    const isEditing = !!reservationData;
    
    // 폼 데이터를 초기화하는 함수
    const getInitialData = () => ({
        customerName: '', 
        customerPhone: '', 
        carInfo: '', 
        reservationDate: new Date(), 
        requestDetails: ''
    });

    const [formData, setFormData] = useState(getInitialData());
    const [errors, setErrors] = useState({}); // 입력 유효성 검사 에러 메시지

    // 모달이 보이거나 수정할 데이터가 바뀔 때마다 실행
    useEffect(() => {
        if (show) {
            // 수정 모드일 경우 기존 데이터로, 아닐 경우 초기 데이터로 폼을 채움
            const dataToSet = reservationData 
                ? { ...reservationData, reservationDate: new Date(reservationData.reservationDate) } 
                : getInitialData();
            setFormData(dataToSet);
            setErrors({}); // 에러 메시지 초기화
        }
    }, [show, reservationData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, reservationDate: date }));
    };

    // 폼 제출 전 유효성 검사
    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = '고객명은 필수입니다.';
        if (!formData.customerPhone.trim()) newErrors.customerPhone = '연락처는 필수입니다.';
        return newErrors;
    };

    const handleSubmit = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // 에러가 있으면 제출 중단
        }
        onSubmit(formData); // 부모 컴포넌트로 데이터 전송
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? '예약 수정' : '신규 예약 추가'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>고객명</Form.Label>
                        <Form.Control type="text" name="customerName" value={formData.customerName} onChange={handleChange} isInvalid={!!errors.customerName} />
                        <Form.Control.Feedback type="invalid">{errors.customerName}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>연락처</Form.Label>
                        <Form.Control type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} isInvalid={!!errors.customerPhone} />
                        <Form.Control.Feedback type="invalid">{errors.customerPhone}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>차량정보</Form.Label>
                        <Form.Control type="text" name="carInfo" value={formData.carInfo} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>예약일시</Form.Label>
                        <DatePicker selected={formData.reservationDate} onChange={handleDateChange} showTimeSelect timeFormat="HH:mm" timeIntervals={30} dateFormat="yyyy-MM-dd, HH:mm" className="form-control" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>요청사항</Form.Label>
                        <Form.Control as="textarea" rows={3} name="requestDetails" value={formData.requestDetails} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <S.Button variant="secondary" onClick={onHide}>취소</S.Button>
                <S.Button variant="primary" onClick={handleSubmit}>{isEditing ? '수정' : '저장'}</S.Button>
            </Modal.Footer>
        </Modal>
    );
};
export default AddReservationModal;