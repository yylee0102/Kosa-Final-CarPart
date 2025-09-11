package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 일반 사용자(회원) 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 생성/수정 시간 자동화를 위해 리스너 추가
public class User {

    /** 사용자 고유 아이디 (PK) */
    @Id
    @Column(name = "user_id")
    private String userId;

    /** 비밀번호 */
    @Column(nullable = false)
    private String password;

    /** 이름 */
    @Column(nullable = false)
    private String name;

    /** 이메일 (로그인 ID로 사용, 고유값) */
    @Column(nullable = false, unique = true)
    private String email;

    /** 전화번호 */
    @Column(name = "phone_number")
    private String phoneNumber;

    /** 생년월일 */
    private LocalDate birthdate;

    /** 역할 (e.g., USER, ADMIN) */
    private String role;

    /** 계정 상태 (활성, 휴면, 탈퇴) */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status;

    /** 소셜 로그인 제공자 (e.g., GOOGLE, KAKAO) */
    @Column(name = "provider")
    private String provider;

    /** 소셜 로그인 사용자의 고유 ID */
    @Column(name = "provider_id")
    private String providerId;

    /** 마케팅 정보 수신 동의 여부 */
    @Column(name = "marketing_agreed")
    private boolean marketingAgreed;

    /** 마지막 로그인 시간 */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    /** 계정 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 계정 마지막 수정 시간 (변경 시 자동 갱신) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- 연관관계 매핑 ---
    /** 이 사용자가 등록한 차량 목록 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCar> userCars = new ArrayList<>();
    // ... (다른 연관관계 매핑은 생략)
}

/**
 * 사용자 계정 상태(UserStatus) Enum
 */
enum UserStatus {
    ACTIVE,     // 활성 상태
    DORMANT,    // 휴면 상태
    WITHDRAWN   // 탈퇴 상태
}