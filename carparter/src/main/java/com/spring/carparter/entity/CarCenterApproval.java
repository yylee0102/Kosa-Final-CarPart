package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

/**
 * 정비소 가입 승인 요청 및 처리 내역을 기록하는 엔티티
 */
@Entity
@Table(name = "car_center_approvals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
public class CarCenterApproval {

    /** 승인 요청 고유 ID (PK, 자동생성) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_id")
    private Long approvalId;

    /** 승인 요청 대상 정비소 (CarCenter) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /** 이 요청을 처리한 관리자 (Admin) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id") // 승인/거절 전에는 null일 수 있음
    private Admin admin;

    /** 관리자가 남긴 처리 사유 (특히 거절 시) */
    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    /** 정비소가 가입을 요청한 시간 */
    @CreatedDate
    @Column(name = "requested_at", updatable = false)
    private LocalDateTime requestedAt;
}

