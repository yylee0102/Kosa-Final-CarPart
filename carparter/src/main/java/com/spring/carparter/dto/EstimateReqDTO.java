package com.spring.carparter.dto;

import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.EstimateItem;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateReqDTO {
    private Integer requestId;
    private Integer estimatedCost;
    private String details;
    private List<EstimateItemReqDTO> estimateItems;
    private String workDuration;
    private String validUntil; // 프론트엔드에서는 'YYYY-MM-DD' 형식의 문자열로 받음

    public Estimate toEntity() {
        LocalDate validUntilDate = null;
        if (this.validUntil != null && !this.validUntil.isEmpty()) {
            validUntilDate = LocalDate.parse(this.validUntil);
        }

        Estimate estimate = Estimate.builder()
                .estimatedCost(this.estimatedCost)
                .details(this.details)
                .workDuration(this.workDuration)
                .validUntil(validUntilDate) // 변환된 LocalDate 객체를 사용
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
