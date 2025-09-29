package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 사용자의 수리 견적 요청 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "quote_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@EntityListeners(AuditingEntityListener.class) // 리스너 추가
public class QuoteRequest {

    /** 견적 요청 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    /** 요청 생성자 (User) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 견적 대상 차량 (UserCar) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_car_id", nullable = false)
    private UserCar userCar;

    /** 요청 상세 내용 */
    @Column(name = "request_details", columnDefinition = "TEXT")
    private String requestDetails;

    /** 생성 시간 (최초 저장 시 자동 생성) */
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 주소 */
    @Column(nullable = false)
    private String address;

    /** 위치기반 서비스를 위한 위도 */
    @Column(name = "latitude")
    private Double latitude;

    /** 위치기반 서비스를 위한 경도 */
    @Column(name = "longitude")
    private Double longitude;

    // ...
    @Builder.Default // ✅ 이 어노테이션을 반드시 추가해야 합니다.
    @OneToMany(mappedBy = "quoteRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequestImage> requestImages = new ArrayList<>(); // ✅ 이 부분을 추가하세요.
// ...

    // ✅ [신규 추가] 연관관계 편의 메소드
    public void addRequestImage(RequestImage requestImage) {
        this.requestImages.add(requestImage);
        requestImage.setQuoteRequest(this); // RequestImage 엔티티에도 QuoteRequest를 설정
    }
    @OneToMany(mappedBy = "quoteRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Estimate> estimates = new ArrayList<>(); // 값이 없어서 보내질 못함
//    // ✅ 아래 코드를 추가해주세요.
//    /** 이 요청에 대해 카센터들이 제출한 견적서 목록 */
//    @OneToMany(mappedBy = "quoteRequest", cascade = CascadeType.ALL, orphanRemoval = true)
//    @BatchSize(size = 10) // N+1 문제를 방지하기 위한 배치 사이즈 설정 (선택적이지만 권장)
//    private List<Estimate> estimates = new ArrayList<>();

}