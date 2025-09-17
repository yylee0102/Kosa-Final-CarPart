package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CarCenterApproval;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarCenterApprovalReqDTO {

    private String centerId; // 승인 대상 정비소 ID
    private String reason;   // (선택) 반려 사유

    /** DTO -> Entity (requestedAt은 @CreatedDate로 자동 세팅) */
    public CarCenterApproval toEntity() {
        return CarCenterApproval.builder()
                .carCenter(CarCenter.builder().centerId(this.centerId).build())
                .reason(this.reason)
                .build();
    }
}
