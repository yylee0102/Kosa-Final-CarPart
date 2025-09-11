package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

/**
 * 고객센터 1:1 문의 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "cs_inquiries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 리스너 추가
public class CsInquiry {

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

    /** 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 마지막 수정 시간 (변경 시 자동 갱신) */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}