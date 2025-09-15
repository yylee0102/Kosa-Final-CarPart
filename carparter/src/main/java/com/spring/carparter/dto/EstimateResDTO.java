package com.spring.carparter.dto;

import com.spring.carparter.entity.Estimate;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class EstimateResDTO {
    private Integer estimateId; // 견적서 고유 ID
    private Integer requestId; // 원본 견적 요청 ID
    private Integer estimatedCost; // 전체 예상 비용
    private String details; // 견적 상세 설명
    private LocalDateTime createdAt; // 견적 제출 시간
    private List<EstimateItemResDTO> estimateItems; // 개별 수리 항목 리스트

    public static EstimateResDTO from(Estimate estimate) {
        return EstimateResDTO.builder()
                .estimateId(estimate.getEstimateId())
                .requestId(estimate.getQuoteRequest().getRequestId())
                .estimatedCost(estimate.getEstimatedCost())
                .details(estimate.getDetails())
                .createdAt(estimate.getCreatedAt())
                .estimateItems(estimate.getEstimateItems().stream()
                        .map(EstimateItemResDTO::from)
                        .collect(Collectors.toList()))
                .build();
    }
}