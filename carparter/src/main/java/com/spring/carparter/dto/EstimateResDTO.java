package com.spring.carparter.dto;

import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@Setter
public class EstimateResDTO {
    private Integer estimateId;
    private Integer requestId;
    private Integer estimatedCost;
    private String details;
    private LocalDateTime createdAt;
    private String status;
    private String centerName;
    private List<EstimateItemResDTO> estimateItems;

    // ✅ [추가] 고객 이름, 차량 모델, 연식 필드를 추가합니다.
    private final String centerId; // ✅ [핵심 추가] 카센터 ID 필드
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
                .centerName(estimate.getCarCenter().getCenterName())
                // ▼▼▼ 이 부분을 추가하세요 ▼▼▼
                .centerId(estimate.getCarCenter().getCenterId())
                // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
                .carModel(userCar.getCarModel())
                .carYear(userCar.getModelYear())
                .workDuration(estimate.getWorkDuration())
                .validUntil(estimate.getValidUntil())
                .build();
    }
}