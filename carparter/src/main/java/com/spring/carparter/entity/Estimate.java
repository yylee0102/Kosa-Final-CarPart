package com.spring.carparter.entity;

import com.spring.carparter.dto.EstimateReqDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter // Dirty Checking을 위해 Setter가 필요할 수 있습니다.
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "estimates")
public class Estimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer estimateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest quoteRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    @Column(nullable = false)
    private Integer estimatedCost;

    @Lob
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstimateStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private String workDuration;
    private LocalDate validUntil;

    @OneToMany(mappedBy = "estimate", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EstimateItem> estimateItems = new ArrayList<>();

    // 연관관계 편의 메소드
    public void addEstimateItem(EstimateItem estimateItem) {
        this.estimateItems.add(estimateItem);
        estimateItem.setEstimate(this);
    }

    @PrePersist
    public void prePersist() {
        this.status = this.status == null ? EstimateStatus.PENDING : this.status;
    }

    /**
     * ✅ [추가] 견적서 수정 로직을 담당하는 메서드
     * DTO를 받아 엔티티의 상태를 변경합니다. (Dirty Checking 활용)
     */
    public void update(EstimateReqDTO requestDto) {
        this.estimatedCost = requestDto.getEstimatedCost();
        this.details = requestDto.getDetails();
        this.workDuration = requestDto.getWorkDuration();

        // String을 LocalDate로 변환
        if (requestDto.getValidUntil() != null && !requestDto.getValidUntil().isEmpty()) {
            this.validUntil = LocalDate.parse(requestDto.getValidUntil());
        } else {
            this.validUntil = null;
        }

        // 기존 세부 항목을 모두 지우고 새로 추가
        if (this.estimateItems != null) {
            this.estimateItems.clear();
        }
        if (requestDto.getEstimateItems() != null) {
            requestDto.getEstimateItems().forEach(itemDto -> {
                addEstimateItem(itemDto.toEntity());
            });
        }
    }
}