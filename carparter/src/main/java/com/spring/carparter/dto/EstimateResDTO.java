package com.spring.carparter.dto;

import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class EstimateResDTO {
    private Integer estimateId;
    private Integer requestId;
    private Integer estimatedCost;
    private String details;
    private LocalDateTime createdAt;
    private String status;
    private List<EstimateItemResDTO> estimateItems;

    // [정리] 모든 필드를 하나로 통합합니다.
    private String customerName;
    private String carModel;
    private Integer carYear;
    private String workDuration;
    private LocalDate validUntil;

    public static EstimateResDTO from(Estimate estimate) {
        QuoteRequest quoteRequest = estimate.getQuoteRequest();
        User user = quoteRequest.getUser();
        UserCar userCar = quoteRequest.getUserCar();

        return EstimateResDTO.builder()
                .estimateId(estimate.getEstimateId())
                .requestId(quoteRequest.getRequestId())
                .estimatedCost(estimate.getEstimatedCost())
                .details(estimate.getDetails())
                .createdAt(estimate.getCreatedAt())
                .status(estimate.getStatus().name())
                .estimateItems(estimate.getEstimateItems().stream()
                        .map(EstimateItemResDTO::from)
                        .collect(Collectors.toList()))
                .customerName(user.getName())
                .carModel(userCar.getCarModel())
                .carYear(userCar.getModelYear())
                .workDuration(estimate.getWorkDuration())
                .validUntil(estimate.getValidUntil())
                .build();
    }
}