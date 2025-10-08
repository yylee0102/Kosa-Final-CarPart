package com.spring.carparter.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 👈 1. 임포트 추가 (이미 있다면 생략)
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 👈 2. 이 어노테이션을 클래스에 추가
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

    /** 이 관리자가 작성한 공지사항 목록 */
    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Announcement> announcements = new ArrayList<>();
}