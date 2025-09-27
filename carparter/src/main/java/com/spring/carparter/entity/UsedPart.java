package com.spring.carparter.entity;

import com.spring.carparter.dto.UsedPartReqDTO;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "used_parts")
@Getter
@Setter // 서비스 로직상 편의를 위해 Setter 유지
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class UsedPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Integer partId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    @Column(nullable = false)
    private String partName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer price;

    private String category;

    @Column(name = "compatible_car_model")
    private String compatibleCarModel;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "usedPart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsedPartImage> images = new ArrayList<>();

    // == 연관관계 편의 메소드 == //
    /**
     * ✅ [추가] UsedPart에 이미지를 추가하면서, UsedPartImage에도 UsedPart를 설정하여 양방향 관계를 동기화합니다.
     * 이 메소드를 사용하면 데이터 불일치를 방지할 수 있습니다.
     */
    public void addImage(UsedPartImage image) {
        this.images.add(image);
        image.setUsedPart(this);
    }

    // == 비즈니스 로직 메소드 == //
    public void updateInfo(UsedPartReqDTO requestDto) {
        if (requestDto.getPartName() != null) {
            this.partName = requestDto.getPartName();
        }
        if (requestDto.getDescription() != null) {
            this.description = requestDto.getDescription();
        }
        if (requestDto.getPrice() != null) {
            this.price = requestDto.getPrice();
        }
        if (requestDto.getCategory() != null) {
            this.category = requestDto.getCategory();
        }
        if (requestDto.getCompatibleCarModel() != null) {
            this.compatibleCarModel = requestDto.getCompatibleCarModel();
        }
    }
}