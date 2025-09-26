package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "used_part_images")
@Getter
@Setter // 양방향 관계 설정을 위해 Setter 필요
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsedPartImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    private UsedPart usedPart;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    // == 연관관계 편의 메소드 == //
    /**
     * ✅ [추가] UsedPart의 addImage 메소드 내부에서 호출되어 양방향 관계를 완성합니다.
     * 이 Setter는 외부에서 직접 호출하기보다는, UsedPart를 통해서만 호출되도록 하는 것이 안전합니다.
     */
    public void setUsedPart(UsedPart usedPart) {
        this.usedPart = usedPart;
    }
}