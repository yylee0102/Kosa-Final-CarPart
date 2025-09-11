package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 정비소가 사용자의 리뷰에 대해 작성한 답변 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "review_replies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewReply extends BaseEntity {

    /** 답변 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private Integer replyId;

    /** 답변이 달린 원본 리뷰 (Review) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    /** 답변을 작성한 정비소 (CarCenter) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /** 답변 내용 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
}