package com.spring.carparter.dto;

import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.EstimateItem;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateReqDTO {
    private Integer requestId;           // 어느 견적 요청에 대한 것인지
    private Integer estimatedCost;       // 전체 예상 비용
    private String details;              // 견적 상세 설명
    private List<EstimateItemReqDTO> estimateItems; // 개별 수리 항목 리스트

    public Estimate toEntity() {
        Estimate estimate = Estimate.builder()
                .estimatedCost(this.estimatedCost)
                .details(this.details)
                .build();

        if (this.estimateItems != null) {
            this.estimateItems.forEach(itemDto -> {
                EstimateItem item = itemDto.toEntity();
                estimate.addEstimateItem(item); // Estimate와 Item 연관관계 연결
            });
        }

        return estimate;
    }
}
