package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * 커뮤니티 게시글의 댓글 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "post_comments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PostComment extends BaseEntity {

    /** 댓글 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    /** 댓글이 달린 원본 게시글 (Post) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    /** 댓글 작성자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 댓글 내용 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
}