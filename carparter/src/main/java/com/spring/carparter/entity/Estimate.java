package com.spring.carparter.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 정비소가 제출한 견적서 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "estimates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Estimate extends BaseEntity {

    /** 견적서 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "estimate_id")
    private Integer estimateId;

    /** 이 견적서가 속한 견적 요청 (QuoteRequest) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest quoteRequest;

    /** 견적서를 제출한 정비소 (CarCenter) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /** 예상 수리 비용 */
    @Column(name = "estimated_cost")
    private Integer estimatedCost;

    /** 견적 상세 내용 */
    @Column(columnDefinition = "TEXT")
    private String details;

    /** 견적 상태 (e.g., SUBMITTED, ACCEPTED, REJECTED) */
    private String status;

    @OneToMany(mappedBy = "estimate")
    private List<CompletedRepair> completedRepairs = new ArrayList<>();
}
