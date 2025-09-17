package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.ReviewReply;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewReplyReqDTO {

    private Integer reviewId; // 원본 리뷰 ID
    private String centerId;  // 답변을 작성하는 정비소 ID
    private String content;   // 답변 내용

    /**
     * ReviewReplyReqDTO를 ReviewReply 엔티티로 변환하는 메서드.
     * @param review 답변이 달릴 원본 Review 엔티티
     * @param carCenter 답변을 작성하는 CarCenter 엔티티
     * @return 변환된 ReviewReply 엔티티 객체
     */
    public ReviewReply toEntity(Review review, CarCenter carCenter) {
        return ReviewReply.builder()
                .review(review)
                .carCenter(carCenter)
                .content(this.content)
                .build();
    }
}