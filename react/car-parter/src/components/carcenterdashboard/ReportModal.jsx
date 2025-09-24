import React, { useState, useEffect } from 'react';
import { Modal, Form, Dropdown, Card } from 'react-bootstrap';
import * as S from '../../css/CarCenterDashboardStyle.jsx';

const ReportModal = ({ show, onHide, onSubmit, review }) => {
    const reportReasons = [
        "부적절한 언어(욕설, 비방)",
        "스팸 또는 광고성 콘텐츠",
        "개인정보 노출",
        "관련 없는 내용"
    ];

    const [selectedReason, setSelectedReason] = useState(reportReasons[0]);
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (show) {
            setSelectedReason(reportReasons[0]);
            setDetails('');
        }
    }, [show]);

    const handleSubmit = () => {
        if (!review) return;
        onSubmit(review.id, selectedReason, details);
    };

    if (!review) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>후기 신고</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>신고할 후기</Form.Label>
                <Card border="light" className="p-3 mb-4 bg-light">
                    <p className="mb-0">"{review.content}"</p>
                </Card>

                <Form.Group className="mb-3">
                    <Form.Label>신고 사유</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle variant="light" className="w-100 text-start border">
                            {selectedReason}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100">
                            {reportReasons.map(reason => (
                                <Dropdown.Item key={reason} onClick={() => setSelectedReason(reason)}>
                                    {reason}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group>
                    <Form.Label>상세 내용 (선택)</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="신고 내용을 구체적으로 작성해주세요."
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <S.Button variant="secondary" onClick={onHide}>취소</S.Button>
                <S.Button variant="danger" onClick={handleSubmit}>신고 접수</S.Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportModal;