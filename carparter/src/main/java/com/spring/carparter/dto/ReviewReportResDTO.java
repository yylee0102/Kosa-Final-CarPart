package com.spring.carparter.dto;

import com.spring.carparter.entity.ReviewReport;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewReportResDTO {
    private Integer reportId;
    private Integer reportedReviewId;
    private String reportingCenterName; // 신고한 정비소 이름
    private String reason;
    private String content;
    private String status;
    private LocalDateTime createdAt;


    public static ReviewReportResDTO from(ReviewReport reviewReport) {
        return ReviewReportResDTO.builder()
                .reportId(reviewReport.getReportId())
                .reportedReviewId(reviewReport.getReview().getReviewId())
                .reportingCenterName(reviewReport.getCarCenter().getCenterName())
                .reason(reviewReport.getReason())
                .content(reviewReport.getContent())
                .status(reviewReport.getStatus())
                .createdAt(reviewReport.getCreatedAt())
                .build();
    }
}