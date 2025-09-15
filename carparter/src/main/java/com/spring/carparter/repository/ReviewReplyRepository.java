package com.spring.carparter.repository;

import com.spring.carparter.entity.ReviewReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewReplyRepository extends JpaRepository<ReviewReply, Integer> {

    /**
     * 특정 리뷰에 달린 답변이 있는지 조회합니다.
     * @param reviewId 원본 리뷰 ID
     * @return Optional<ReviewReply>
     */
    Optional<ReviewReply> findByReview_ReviewId(Integer reviewId);


}