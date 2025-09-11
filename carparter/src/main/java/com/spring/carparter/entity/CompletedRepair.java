package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 수리가 완료된 내역 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "completed_repairs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompletedRepair extends BaseEntity {

    /** 수리 내역 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repair_id")
    private Integer repairId;

    /** 기반이 된 견적 요청 (QuoteRequest) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest quoteRequest;

    /** 채택된 견적서 (Estimate) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    /** 수리를 받은 사용자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 수리를 진행한 정비소 (CarCenter) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /** 최종 수리 비용 */
    @Column(name = "final_cost")
    private Integer finalCost;

    /** 사용자가 견적을 승인한 시간 */
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    /** 수리가 완료된 날짜 */
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
}