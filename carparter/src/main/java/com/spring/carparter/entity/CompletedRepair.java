package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "completed_repairs")
@Getter
@Setter // Service에서 상태 변경을 위해 추가
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CompletedRepair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repair_id") // ⬅️ DB 컬럼명 명시
    private Long repairId; // ⬅️ 필드 이름 변경 (id -> repairId)

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "center_id", nullable = false)
    private String carCenterId;

    @Column(name = "center_name", nullable = false)
    private String carCenterName;

    @Column(name = "original_request_id")
    private Integer originalRequestId;

    @Column(name = "original_estimate_id")
    private Integer originalEstimateId;

    @Column(nullable = false)
    private Integer finalCost;

    @Column(columnDefinition = "TEXT")
    private String repairDetails;

    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    private RepairStatus status;
    @Column(name = "car_model") // DB 컬럼명 지정
    private String carModel;

    @Column(name = "license_plate") // DB 컬럼명 지정
    private String licensePlate;

    @CreationTimestamp // 엔티티 생성 시 자동으로 값을 채워줌
    @Column(name = "created_at", updatable = false) // 생성 시간은 업데이트되지 않도록 설정
    private LocalDateTime createdAt;
    // 잘못된 빌더 코드는 여기서 제거합니다.

    // ▼▼▼ 이 코드를 추가하세요 ▼▼▼
    @OneToOne(mappedBy = "completedRepair", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Review review;
}