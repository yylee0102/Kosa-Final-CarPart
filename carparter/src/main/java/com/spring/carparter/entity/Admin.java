package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 서비스 관리자 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "admin")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Admin {

    /** 관리자 고유 아이디 (PK) */
    @Id
    @Column(name = "admin_id")
    private String adminId;

    /** 비밀번호 */
    @Column(nullable = false)
    private String password;

    /** 관리자 이름 */
    @Column(nullable = false)
    private String name;

    /** 관리자 역할 (e.g., SUPER_ADMIN, CS_ADMIN) */
    private String role;

    /** 계정 생성일 */
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 이 관리자가 작성한 공지사항 목록 */
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Announcement> announcements = new ArrayList<>();
}