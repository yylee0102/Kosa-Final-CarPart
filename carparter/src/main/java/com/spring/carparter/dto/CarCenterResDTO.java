package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CarCenterResDTO {
    private String centerId; // 카센터 고유 ID

    private String centerName; // 업체명
    private String address; // 주소
    private String phoneNumber; // 연락처
    private String openingHours; // 영업시간
    private String description; // 업체 소개

    public static CarCenterResDTO from(CarCenter carCenter) {
        return CarCenterResDTO.builder()
                .centerId(carCenter.getCenterId())

                .centerName(carCenter.getCenterName())
                .address(carCenter.getAddress())
                .phoneNumber(carCenter.getPhoneNumber())
                .openingHours(carCenter.getOpeningHours())
                .description(carCenter.getDescription())
                .build();
    }
}