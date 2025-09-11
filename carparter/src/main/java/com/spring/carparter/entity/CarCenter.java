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
 * 정비소(제휴 업체) 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "car_centers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 생성/수정 시간 자동화를 위해 리스너 추가
public class CarCenter {

    /** 정비소 고유 ID (PK, 자동생성) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_id")
    private Integer centerId;

    /** 이메일 (로그인 ID로 사용, 고유값) */
    @Column(nullable = false, unique = true)
    private String email;

    /** 비밀번호 */
    @Column(nullable = false)
    private String password;

    /** 정비소 이름 */
    @Column(name = "center_name", nullable = false)
    private String centerName;

    /** 주소 */
    @Column(nullable = false)
    private String address;

    /** 전화번호 */
    @Column(name = "phone_number")
    private String phoneNumber;

    /** 정비소 상세 설명 */
    private String description;

    /** 정비소 상태 (승인대기, 승인, 정지 등) */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CarCenterStatus status;

    /** 사업자 등록 번호 */
    @Column(name = "business_registration_number")
    private String businessRegistrationNumber;

    /** 위치기반 서비스를 위한 위도 */
    @Column(name = "latitude")
    private Double latitude;

    /** 위치기반 서비스를 위한 경도 */
    @Column(name = "longitude")
    private Double longitude;

    /** 운영 시간 정보 (e.g., "평일 09:00 - 18:00") */
    @Column(name = "opening_hours")
    private String openingHours;

    /** 계정 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 계정 마지막 수정 시간 (변경 시 자동 갱신) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- 연관관계 매핑 ---
    /** 이 정비소가 제출한 견적서 목록 */
    @OneToMany(mappedBy = "carCenter")
    private List<Estimate> estimates = new ArrayList<>();
    // ... (다른 연관관계 매핑은 생략)
}

/**
 * 정비소 상태(CarCenterStatus) Enum
 */
enum CarCenterStatus {
    PENDING_APPROVAL, // 승인 대기
    APPROVED,         // 승인 완료 (운영 중)
    REJECTED,         // 승인 거절
    SUSPENDED         // 운영 정지
}