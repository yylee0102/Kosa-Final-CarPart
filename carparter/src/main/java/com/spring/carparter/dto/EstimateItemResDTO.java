package com.spring.carparter.dto;

import com.spring.carparter.entity.EstimateItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EstimateItemResDTO {
    private Long itemId; // 항목 고유 ID
    private String itemName; // 항목 이름
    private Integer price; // 항목 가격
    private Integer requiredHours; // 예상 소요 시간
    private String partType; // 부품 종류
    private int quantity; // ✅ [추가]

    public static EstimateItemResDTO from(EstimateItem estimateItem) {
        return EstimateItemResDTO.builder()
                .itemId(estimateItem.getItemId())
                .itemName(estimateItem.getItemName())
                .price(estimateItem.getPrice())
                .requiredHours(estimateItem.getRequiredHours())
                .partType(estimateItem.getPartType())
                .quantity(estimateItem.getQuantity()) // ✅ [추가]

                .build();
    }
}