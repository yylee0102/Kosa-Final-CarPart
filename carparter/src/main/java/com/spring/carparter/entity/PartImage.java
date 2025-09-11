package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 중고부품 게시글에 첨부된 이미지 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "part_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartImage {

    /** 이미지 고유 ID (PK, 자동생성) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    /** 이미지가 속한 중고부품 게시글 (UsedPart) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    private UsedPart usedPart;

    /** 이미지 파일의 URL */
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}