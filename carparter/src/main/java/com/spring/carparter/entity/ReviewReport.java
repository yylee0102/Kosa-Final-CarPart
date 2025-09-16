package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ReviewReport {

    /**
     * 신고 고유 ID (PK)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    /**
     * 신고 대상 리뷰 (Review)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    /**
     * 신고한 카센터 (CarCenter)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /**
     * 신고 사유
     * (예: "욕설/비방", "광고성 콘텐츠", "개인정보 노출", "허위/조작 정보")
     */
    @Column(nullable = false)
    private String reason;

    /**
     * 신고 상세 내용
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * 신고 처리 상태
     * (예: PENDING, APPROVED, REJECTED)
     */
    private String status;


    /**
     * 신고 생성 시간 (최초 저장 시 자동 생성)
     */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
