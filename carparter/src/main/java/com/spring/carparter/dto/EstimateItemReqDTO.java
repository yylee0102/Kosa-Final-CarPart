package com.spring.carparter.dto;

import com.spring.carparter.entity.EstimateItem;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateItemReqDTO {
    private String itemName; // 항목 이름
    private Integer price; // 항목 가격
    private Integer requiredHours; // 예상 소요 시간
    private String partType; // 부품 종류
    private int quantity;
    public EstimateItem toEntity() {
        return EstimateItem.builder()
                .itemName(this.itemName)
                .price(this.price)
                .requiredHours(this.requiredHours)
                .partType(this.partType)
                .quantity(this.quantity)
                .build();
    }
}