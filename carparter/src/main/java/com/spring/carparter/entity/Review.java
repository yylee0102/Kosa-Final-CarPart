package com.spring.carparter.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자가 정비소에 대해 작성한 리뷰 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review extends BaseEntity {

    /** 리뷰 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    /** 리뷰 대상 정비소 (CarCenter) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /** 리뷰 작성자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 어떤 수리 건에 대한 리뷰인지 연결 (신뢰도) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_id")
    private CompletedRepair completedRepair;

    /** 평점 (1~5) */
    private Integer rating;

    /** 리뷰 제목 */
    private String title;

    /** 리뷰 상세 내용 */
    @Column(columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewReply> reviewReplies = new ArrayList<>();
}