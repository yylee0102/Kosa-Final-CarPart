package com.spring.carparter.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 커뮤니티 게시글 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "posts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Post extends BaseEntity {

    /** 게시글 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Integer postId;

    /** 게시글 작성자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 게시글 제목 */
    @Column(nullable = false)
    private String title;

    /** 게시글 내용 */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /** 조회수 */
    @Column(name = "view_count")
    private Integer viewCount = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostComment> postComments = new ArrayList<>();
}