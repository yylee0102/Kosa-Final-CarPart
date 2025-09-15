package com.spring.carparter.repository;

import com.spring.carparter.entity.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ReviewReply 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 */
@Repository
public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Long> {

    /**
     * 특정 리뷰에 달린 답글을 조회합니다.
     * 리뷰와 답글은 보통 1:1 관계이므로 Optional로 반환합니다.
     *
     * @param reviewId 원본 리뷰의 고유 ID
     * @return 해당 리뷰의 답글(ReviewReply) 정보 (Optional)
     */
    Optional<ReviewReply> findByReviewReviewId(Integer reviewId);
}