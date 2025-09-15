package com.spring.carparter.entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자가 정비소에 대해 작성한 리뷰 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 리스너 추가
public class Review {

    /**
     * 리뷰 고유 ID (PK)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    /**
     * 리뷰 대상 정비소 (CarCenter)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    /**
     * 리뷰 작성자 (User)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 어떤 수리 건에 대한 리뷰인지 연결 (신뢰도)
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_id")
    private CompletedRepair completedRepair;

    /**
     * 평점 (1~5)
     */
    private Integer rating;

    /**
     * 리뷰 제목
     */
    private String title;

    /**
     * 리뷰 상세 내용
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * 생성 시간 (최초 저장 시 자동 생성)
     */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}