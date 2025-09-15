package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 견적 항목에 포함된 부품 이미지 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "part_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PartImage {

    /** 이미지 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;

    /** 이미지 URL 또는 파일 경로 */
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    /** 이 이미지가 속한 견적 항목 (EstimateItem) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private EstimateItem estimateItem;

    // ⚠️ 무한 루프 방지를 위해 toString() 메서드에 estimateItem 필드를 제외해야 합니다.
    // Lombok의 @ToString(exclude = "estimateItem")를 사용하거나 직접 구현 시 제외.
}