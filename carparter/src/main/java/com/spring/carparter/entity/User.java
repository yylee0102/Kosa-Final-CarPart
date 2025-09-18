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
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    /** 전화번호 */
    @Column(name = "phone_number")
    private String phoneNumber;

    /** 주민번호 앞자리 6, 뒷자리 1 */
    private String ssn;

    /** 마케팅 정보 수신 동의 여부 */
    @Column(name = "marketing_agreed")
    private boolean marketingAgreed;

    // --- 연관관계 매핑 ---
    /** 이 사용자가 등록한 차량 목록 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCar> userCars = new ArrayList<>();
    // ... (다른 연관관계 매핑은 생략)
}

