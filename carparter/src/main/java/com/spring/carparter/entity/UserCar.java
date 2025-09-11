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
 * 사용자가 등록한 차량 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "user_cars")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 생성/수정 시간 자동화를 위해 리스너 추가
public class UserCar {

    /** 등록 차량 고유 ID (PK, 자동생성) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_car_id")
    private Integer userCarId;

    /** 차량 소유자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 자동차 모델명 */
    @Column(name = "car_model", nullable = false)
    private String carModel;

    /** 자동차 번호 */
    @Column(name = "car_number", nullable = false)
    private String carNumber;

    /** 자동차 연식 */
    @Column(name = "model_year")
    private Integer modelYear;

    /** 등록 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 마지막 수정 시간 (변경 시 자동 갱신) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** 이 차량으로 요청된 견적 목록 */
    @OneToMany(mappedBy = "userCar")
    private List<QuoteRequest> quoteRequests = new ArrayList<>();
}