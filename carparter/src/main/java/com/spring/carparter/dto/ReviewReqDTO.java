package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewReqDTO {

    private String centerId; // 리뷰를 남길 정비소 ID
    private Integer rating;  // 평점
    private String content;  // 내용

    // DTO를 Review 엔티티로 변환하는 메서드 (Service에서 사용)
    public Review toEntity(CarCenter carCenter, User user) {
        return Review.builder()
                .carCenter(carCenter)
                .user(user)
                .rating(this.rating)
                .content(this.content)
                .build();
    }
}