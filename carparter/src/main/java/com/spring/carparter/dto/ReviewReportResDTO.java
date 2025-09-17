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
    public ReviewReportResDTO(com.spring.carparter.entity.ReviewReport r) {
        // r의 필드만 사용해서 DTO 필드 세팅 (네 DTO 필드명에 맞춰 작성)
        this.reportId   = r.getReportId();
        this.createdAt  = r.getCreatedAt();
        this.status     = r.getStatus();
        this.reason     = r.getReason();
        // 연관 객체(예: r.getReview(), r.getReporter())를 여기서 건드리면 LAZY 추가쿼리 납니다.
    }
}