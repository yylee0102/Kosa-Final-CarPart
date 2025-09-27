// CarCenterResDTO.java

package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CarCenterStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CarCenterResDTO {
    private String centerId;
    private String centerName;
    private String address;
    private String phoneNumber;
    private String openingHours;
    private String description;
    private CarCenterStatus status;

    // ✅ [추가] 프론트엔드에서 필요한 필드들을 추가합니다.
    private String businessRegistrationNumber;
    private Double latitude;
    private Double longitude;

    public static CarCenterResDTO from(CarCenter carCenter) {
        return CarCenterResDTO.builder()
                .centerId(carCenter.getCenterId())
                .centerName(carCenter.getCenterName())
                .address(carCenter.getAddress())
                .phoneNumber(carCenter.getPhoneNumber())
                .openingHours(carCenter.getOpeningHours())
                .description(carCenter.getDescription())
                .status(carCenter.getStatus())
                // ✅ [추가] 추가된 필드들을 매핑합니다.
                .businessRegistrationNumber(carCenter.getBusinessRegistrationNumber())
                .latitude(carCenter.getLatitude())
                .longitude(carCenter.getLongitude())
                .build();
    }
}