package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 중고부품 판매 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "used_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class) // 생성/수정 시간 자동화를 위해 리스너 추가
public class UsedPart {

    /** 중고부품 게시글 고유 ID (PK, 자동생성) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Integer partId;

    /** 판매자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User seller;

    /** 부품 이름 (e.g., "LF 쏘나타 순정 18인치 휠") */
    @Column(nullable = false)
    private String partName;

    /** 부품에 대한 상세 설명 (상태, 사용기간 등) */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** 판매 가격 */
    @Column(nullable = false)
    private Integer price;

    /** 부품 카테고리 (e.g., 휠/타이어, 엔진, 외장 등) */
    private String category;

    /** 이 부품이 호환되는 차량 모델명 */
    @Column(name = "compatible_car_model")
    private String compatibleCarModel;

    /** 거래 상태 (판매중, 예약중, 판매완료) */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PartStatus status;

    /** 게시글 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 게시글 마지막 수정 시간 (변경 시 자동 갱신) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** 이 부품에 첨부된 이미지 목록 */
    @OneToMany(mappedBy = "usedPart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PartImage> images = new ArrayList<>();
}

/**
 * 중고부품 거래 상태(PartStatus) Enum
 */
enum PartStatus {
    /** <b>FOR_SALE</b>: 현재 판매 중인 상태 */
    FOR_SALE,

    /** <b>RESERVED</b>: 거래가 예약된 상태 */
    RESERVED,

    /** <b>SOLD</b>: 판매가 완료된 상태 */
    SOLD
}