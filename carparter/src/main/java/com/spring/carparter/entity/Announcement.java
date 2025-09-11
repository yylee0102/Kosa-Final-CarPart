package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 관리자가 작성하는 공지사항 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "announcements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Announcement extends BaseEntity {

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
}