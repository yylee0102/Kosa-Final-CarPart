package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarCenterReqDTO {
    //로그인
    // 이메일 (로그인 ID)
    private String password; // 비밀번호
    private String centerName; // 업체명
    private String address; // 주소
    private String phoneNumber; // 연락처
    private String businessRegistrationNumber; // 사업자등록번호
    private String openingHours; // 영업시간
    private String description; // 업체 소개

    /**
     * DTO의 정보를 바탕으로 CarCenter 엔티티 객체를 생성하여 반환합니다.
     * @return CarCenter 엔티티
     */
    public CarCenter toEntity() {
        return CarCenter.builder()
                .password(this.password) // 나중에 시큐리티 들어갈때  비밀번호를 암호화
                .centerName(this.centerName)
                .address(this.address)
                .phoneNumber(this.phoneNumber)
                .businessRegistrationNumber(this.businessRegistrationNumber)
                .openingHours(this.openingHours)
                .description(this.description)
                .build();
    }
}