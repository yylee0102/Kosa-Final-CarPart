package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 견적 요청에 첨부된 이미지 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "request_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RequestImage {

    /** 이미지 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    /** 이미지가 속한 견적 요청 (QuoteRequest) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest quoteRequest;

    /** 이미지 파일의 URL */
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}