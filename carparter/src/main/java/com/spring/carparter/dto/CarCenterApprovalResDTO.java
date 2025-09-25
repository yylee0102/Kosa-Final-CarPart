package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenterApproval;
import com.spring.carparter.entity.CarCenterStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CarCenterApprovalResDTO {

    private Long approvalId;
    private LocalDateTime requestedAt;
    private String centerId;
    private String centerName;

    private String businessNumber;
    private String phoneNumber;
    private String address;
    private CarCenterStatus status;


    public CarCenterApprovalResDTO(Long approvalId, LocalDateTime requestedAt, String centerId, String centerName, String businessNumber, String phoneNumber, String address, CarCenterStatus status) {
        this.approvalId = approvalId;
        this.requestedAt = requestedAt;
        this.centerId = centerId;
        this.centerName = centerName;
        this.businessNumber = businessNumber;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.status = status;
    }
}
