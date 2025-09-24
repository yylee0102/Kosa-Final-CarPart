import React, { useState, useEffect } from 'react';
import { Modal, Form, Card } from 'react-bootstrap';
import * as S from '../../css/CarCenterDashboardStyle.jsx';

const ReplyModal = ({ show, onHide, onSubmit, review }) => {
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        if (review) {
            setReplyContent(review.reply?.content || '');
        }
    }, [review]);

    const handleSubmit = () => {
        if (!replyContent.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }
        onSubmit(review.id, replyContent);
    };

    if (!review) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>리뷰 답변 관리</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card border="light" className="p-3 mb-3 bg-light">
                    <p className="mb-1"><strong>작성자:</strong> {review.author}</p>
                    <p className="mb-0"><strong>내용:</strong> {review.content}</p>
                </Card>
                <Form>
                    <Form.Group>
                        <Form.Label>답변 내용</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={5}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="답변을 입력하세요..."
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <S.Button variant="secondary" onClick={onHide}>취소</S.Button>
                <S.Button variant="primary" onClick={handleSubmit}>답변 등록</S.Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReplyModal;