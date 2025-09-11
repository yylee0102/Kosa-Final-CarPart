package com.spring.carparter.entity;
// package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 고객센터 1:1 문의 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "cs_inquiries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CsInquiry extends BaseEntity {

    /** 문의 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Integer inquiryId;

    /** 문의를 남긴 사용자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /** 문의 제목 */
    @Column(nullable = false)
    private String title;

    /** 질문 내용 */
    @Column(name = "question_content", columnDefinition = "TEXT", nullable = false)
    private String questionContent;

    /** 관리자의 답변 내용 */
    @Column(name = "answer_content", columnDefinition = "TEXT")
    private String answerContent;

    /** 답변이 달린 시간 */
    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
}