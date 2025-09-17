package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenterApproval;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CarCenterApprovalResDTO {

    private Long approvalId;           // 승인요청 PK
    private LocalDateTime requestedAt; // 요청 시각
    private String centerId;           // 정비소 ID
    private String centerName;         // 정비소명

    /** Entity -> DTO */
    public static CarCenterApprovalResDTO from(CarCenterApproval c) {
        var cc = c.getCarCenter();
        return CarCenterApprovalResDTO.builder()
                .approvalId(c.getApprovalId())
                .requestedAt(c.getRequestedAt())
                .centerId(cc != null ? cc.getCenterId() : null)
                .centerName(cc != null ? cc.getCenterName() : null)
                .build();
    }
    public CarCenterApprovalResDTO (Long approvalId, LocalDateTime requestedAt, String centerId, String centerName) {
        this.approvalId = approvalId;
        this.requestedAt = requestedAt;
        this.centerId = centerId;
        this.centerName = centerName;
    }
}
