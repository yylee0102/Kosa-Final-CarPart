package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 견적서에 포함되는 개별 수리 항목을 나타내는 엔티티
 */
@Entity
@Table(name = "estimate_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EstimateItem {

    /** 견적 항목 고유 ID (PK, 자동생성) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    /** 수리 항목 이름 (e.g., "엔진 오일 교체") */
    @Column(name = "item_name", nullable = false)
    private String itemName;

    /** 예상 금액 */
    @Column(nullable = false)
    private Integer price;

    /** 소요 시간 (시간 단위) */
    @Column(name = "required_hours", nullable = false)
    private Integer requiredHours;

    /** 옵션 (부품 종류: 중고, 정품 등) */
    @Column(name = "part_type")
    private String partType;

    // ⚠️ 무한 루프 방지를 위해 toString() 메서드에 estimate 필드를 제외해야 합니다.
    // Lombok의 @ToString(exclude = "estimate")를 사용하거나 직접 구현 시 제외.
}