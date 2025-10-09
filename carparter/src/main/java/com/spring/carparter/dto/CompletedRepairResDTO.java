package com.spring.carparter.dto;

import com.spring.carparter.entity.CompletedRepair;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CompletedRepairResDTO {

    private Long id;
    private String userName;
    private String carCenterName;
    private String carCenterId;
    private Integer finalCost;
    private String repairDetails;
    private LocalDateTime completedAt;
    private String status;
    private String carModel;
    private String licensePlate;
    private LocalDateTime createdAt;
    private Integer reviewId;
    /**
     * CompletedRepair 엔티티를 DTO로 변환하는 정적 팩토리 메소드
     */
    public static CompletedRepairResDTO from(CompletedRepair entity) {
        return CompletedRepairResDTO.builder()
                .id(entity.getId())
                .userName(entity.getUserName())
                .carCenterName(entity.getCarCenterName())
                .carCenterId(entity.getCarCenterId())
                .finalCost(entity.getFinalCost())
                .repairDetails(entity.getRepairDetails())
                .completedAt(entity.getCompletedAt())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .carModel(entity.getCarModel())
                .licensePlate(entity.getLicensePlate())
                .createdAt(entity.getCreatedAt())
                .reviewId(entity.getReview() != null ? entity.getReview().getReviewId() : null)
                .build();
    }
}