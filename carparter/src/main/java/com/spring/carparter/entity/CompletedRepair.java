package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
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
    private Long id;

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

    // 잘못된 빌더 코드는 여기서 제거합니다.
}