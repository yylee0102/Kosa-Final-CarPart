package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 정비소가 제출한 견적서 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "estimates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
public class Estimate {

    /**
     * 견적서 고유 ID (PK)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "estimate_id")
    private Integer estimateId;

    /**
     * 이 견적서가 속한 견적 요청 (QuoteRequest)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest quoteRequest;

    /**
     * 견적서를 제출한 정비소 (CarCenter)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /**
     * 예상 수리 비용
     */
    @Column(name = "estimated_cost")
    private Integer estimatedCost;

    /**
     * 견적 상세 내용
     */
    @Column(columnDefinition = "TEXT")
    private String details;

    /**
     * 생성 시간 (최초 저장 시 자동 생성)
     */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstimateStatus status = EstimateStatus.PENDING;


    // 이전에 있던 List<CompletedRepair> 필드는 제거되었습니다.

    // ✅ 변경된 부분: mappedBy를 사용하여 양방향 관계로 변경
    // 'estimate' 필드는 EstimateItem 엔티티에 있는 부모 참조 필드 이름입니다.
    @OneToMany(mappedBy = "estimate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstimateItem> estimateItems = new ArrayList<>();

    // 양방향 관계를 편하게 관리하기 위한 메서드
    public void addEstimateItem(EstimateItem item) {
        this.estimateItems.add(item);
        item.setEstimate(this);
    }
}