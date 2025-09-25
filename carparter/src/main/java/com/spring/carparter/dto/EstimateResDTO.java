// ✅ 아래 코드로 파일을 교체하세요.
package com.spring.carparter.dto;

import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class EstimateResDTO {

    // --- 기존 필드 ---
    private Integer estimateId;
    private Integer requestId;
    private Integer estimatedCost;
    private String details;
    private LocalDateTime createdAt;
    private String status; // ✅ 타입을 String으로 변경하여 Enum name을 담도록 함

    // ✅ UI 표시를 위해 추가된 필드들
    private String customerName; // 고객 이름
    private String carModel;     // 차량 모델
    private Integer carYear;      // 차량 연식
    // private LocalDateTime validUntil; // 견적 유효기간 (Estimate 엔티티에 필드가 있다면 추가)

    private List<EstimateItemResDTO> estimateItems;

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
                .status(estimate.getStatus().name()) // Enum의 이름을 문자열로 변환
                .estimateItems(estimate.getEstimateItems().stream()
                        .map(EstimateItemResDTO::from)
                        .collect(Collectors.toList()))

                // ✅ 추가된 필드 값 채우기
                .customerName(user.getName())
                .carModel(userCar.getCarModel())
                .carYear(userCar.getModelYear())
                // .validUntil(estimate.getValidUntil()) // Estimate 엔티티에 validUntil 필드가 있다면 추가
                .build();
    }
}