package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.ReviewReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewReportReqDTO {

    private Integer reviewId;
    private String centerId; // 신고하는 정비소 ID
    private String reason;
    private String content;

    public ReviewReport toEntity(Review review, CarCenter carCenter) {
        return ReviewReport.builder()
                .review(review)
                .carCenter(carCenter)
                .reason(this.reason)
                .content(this.content)
                .status("PENDING") // 신고 접수 시 기본 상태
                .build();
    }
}