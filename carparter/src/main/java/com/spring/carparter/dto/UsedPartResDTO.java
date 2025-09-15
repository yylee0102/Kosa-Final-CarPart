package com.spring.carparter.dto;

import com.spring.carparter.entity.UsedPart;
import com.spring.carparter.entity.UsedPartImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder // ✨ 빌더 패턴으로 객체를 생성할 수 있습니다.
@AllArgsConstructor
public class UsedPartResDTO {

    /** 중고부품 게시글 고유 ID (PK) */
    private Integer partId;

    /** 부품을 등록한 카센터의 고유 ID */
    private String centerId;

    /** 부품 이름 */
    private String partName;

    /** 부품 상세 설명 */
    private String description;

    /** 판매 가격 */
    private Integer price;

    /** 부품 카테고리 */
    private String category;

    /** 호환되는 차량 모델명 */
    private String compatibleCarModel;

    /** 게시글 생성 시간 */
    private LocalDateTime createdAt;

    /** 부품 이미지 URL 목록 */
    private List<String> imageUrls;

    /**
     * UsedPart 엔티티를 UsedPartResDTO로 변환하는 정적 팩토리 메소드.
     * 빌더 패턴을 내부적으로 사용하여 객체를 생성합니다.
     * 이 방식을 사용하면 서비스 코드에서 변환 로직을 깔끔하게 유지할 수 있습니다.
     */
    public static UsedPartResDTO from(UsedPart usedPart) {
        return UsedPartResDTO.builder()
                .partId(usedPart.getPartId())
                .centerId(usedPart.getCarCenter().getCenterId())
                .partName(usedPart.getPartName())
                .description(usedPart.getDescription())
                .price(usedPart.getPrice())
                .category(usedPart.getCategory())
                .compatibleCarModel(usedPart.getCompatibleCarModel())
                .createdAt(usedPart.getCreatedAt())
                .imageUrls(usedPart.getImages().stream()
                        .map(UsedPartImage::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }
}