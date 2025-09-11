package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자의 수리 견적 요청 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "quote_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 리스너 추가
public class QuoteRequest {

    /** 견적 요청 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    /** 요청 생성자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 견적 대상 차량 (UserCar) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_car_id", nullable = false)
    private UserCar userCar;

    /** 요청 상세 내용 */
    @Column(name = "request_details", columnDefinition = "TEXT")
    private String requestDetails;

    /** 요청 상태 (e.g., REQUESTED, IN_PROGRESS, COMPLETED) */
    private String status;

    /** 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 마지막 수정 시간 (변경 시 자동 갱신) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "quoteRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestImage> requestImages = new ArrayList<>();
    @OneToMany(mappedBy = "quoteRequest")
    private List<Estimate> estimates = new ArrayList<>();
    @OneToMany(mappedBy = "quoteRequest")
    private List<ChatRoom> chatRooms = new ArrayList<>();
    @OneToMany(mappedBy = "quoteRequest")
    private List<CompletedRepair> completedRepairs = new ArrayList<>();
}