package com.spring.carparter.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // 👈 1. 이 줄을 임포트합니다.
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

/**
 * 관리자가 작성하는 공지사항 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "announcements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 👈 2. 이 어노테이션을 클래스에 추가합니다.
public class Announcement {

    /** 공지사항 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "announcement_id")
    private Integer announcementId;

    /** 공지사항 작성자 (Admin) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    /** 공지사항 제목 */
    @Column(nullable = false)
    private String title;

    /** 공지사항 내용 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}