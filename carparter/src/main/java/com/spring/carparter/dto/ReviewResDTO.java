package com.spring.carparter.dto;

import com.spring.carparter.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResDTO {

    private Integer reviewId;
    private String centerName; // 정비소 이름
    private String writerName; // 작성자 이름 (User 엔티티의 name 필드 가정)
    private Integer rating;
    private String title;
    private String content;
    private LocalDateTime createdAt;

    // Review 엔티티를 DTO로 변환하는 정적 팩토리 메서드
    public static ReviewResDTO from(Review review) {
        return ReviewResDTO.builder()
                .reviewId(review.getReviewId())
                .centerName(review.getCarCenter().getCenterName())
                .writerName(review.getUser().getName()) // User 엔티티에 getName()이 있다고 가정
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}