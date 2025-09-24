import React, { useState, useEffect } from 'react';
import ReplyModal from './ReplyModal.jsx';
import apiClient from '../commons/apiClient.jsx';
import * as S from '../../css/CarCenterDashboardStyle.jsx';

const initialSampleReviews = [
    { id: 1, content: '꼼꼼하게 잘 봐주셔서 감사합니다!', author: '김민준', rating: 5, date: '2025-09-08', reply: '방문해주셔서 감사합니다! 언제나 최선을 다하겠습니다.' },
    { id: 2, content: '설명이 친절해서 좋았어요.', author: '최은지', rating: 4, date: '2025-09-07', reply: null },
    { id: 3, content: '보통입니다.', author: '이서연', rating: 3, date: '2025-09-05', reply: null },
    { id: 4, content: '시간 약속을 잘 지켜주셔서 좋았습니다.', author: '박준형', rating: 5, date: '2025-09-04', reply: '감사합니다. 다음에도 신속 정확하게 서비스하겠습니다.' },
    { id: 5, content: '가격이 조금 비싼 것 같아요.', author: '정수빈', rating: 3, date: '2025-09-03', reply: null },
    { id: 6, content: '다음에도 방문할게요!', author: '윤지후', rating: 5, date: '2025-09-02', reply: null },
];

const ReviewSection = () => {
    const [allReviews, setAllReviews] = useState(initialSampleReviews);
    const [reviewsOnPage, setReviewsOnPage] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const PAGE_SIZE = 5;
        setTotalPages(Math.ceil(allReviews.length / PAGE_SIZE));
        const pagedData = allReviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
        setReviewsOnPage(pagedData);
    }, [currentPage, allReviews]);

    const handleReplyClick = (review) => {
        setSelectedReview(review);
        setShowReplyModal(true);
    };

    const handleReplySubmit = (reviewId, content) => {
        setAllReviews(prevReviews => 
            prevReviews.map(review => 
                review.id === reviewId ? { ...review, reply: content } : review
            )
        );
        setShowReplyModal(false);
    };

    return (
        <>
            <S.CardHeader>
                <h5>후기 관리</h5>
            </S.CardHeader>

            <S.Table hover responsive>
                <thead>
                    <tr>
                        <th>내용</th><th>작성자</th><th>평점</th><th>작성일</th><th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewsOnPage.map((review) => (
                        <tr key={review.id}>
                            <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{review.content}</td>
                            <td>{review.author}</td>
                            <td>{'⭐'.repeat(review.rating)}</td>
                            <td>{review.date}</td>
                            <td>
                                {review.reply ? (
                                    <S.Button variant="success" size="sm" onClick={() => handleReplyClick(review)}>답변 수정</S.Button>
                                ) : (
                                    <>
                                        <S.Button variant="primary" size="sm" className="me-2" onClick={() => handleReplyClick(review)}>답글</S.Button>
                                        <S.Button variant="danger" size="sm">신고</S.Button>
                                    </>
                                )}
                            </td>
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

            <ReplyModal 
                show={showReplyModal}
                onHide={() => setShowReplyModal(false)}
                onSubmit={handleReplySubmit}
                review={selectedReview}
            />
        </>
    );
};

export default ReviewSection;