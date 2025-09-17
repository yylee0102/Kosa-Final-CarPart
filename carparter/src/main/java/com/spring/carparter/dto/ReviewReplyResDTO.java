package com.spring.carparter.dto;

import com.spring.carparter.entity.ReviewReply;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewReplyResDTO {

    private Integer replyId;
    private Integer reviewId;
    private String centerName;
    private String content;
    private LocalDateTime createdAt;

    // ReviewReply 엔티티를 이 DTO로 변환하는 정적 메서드
    public static ReviewReplyResDTO from(ReviewReply reviewReply) {
        return ReviewReplyResDTO.builder()
                .replyId(reviewReply.getReplyId())
                .reviewId(reviewReply.getReview().getReviewId())
                .centerName(reviewReply.getCarCenter().getCenterName())
                .content(reviewReply.getContent())
                .createdAt(reviewReply.getCreatedAt())
                .build();
    }
}