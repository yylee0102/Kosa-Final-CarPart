package com.spring.carparter.dto;

import com.spring.carparter.entity.UserCar;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCarResDTO {

    private Long userCarId;
    private String carModel;
    private String carNumber;
    private Integer modelYear;
    private LocalDateTime createdAt;

    /**
     * UserCar 엔티티를 UserCarResDTO로 변환하는 정적 팩토리 메서드
     * @param userCar 엔티티 객체
     * @return DTO 객체
     */
    public static UserCarResDTO from(UserCar userCar) {
        return UserCarResDTO.builder()
                .userCarId(userCar.getUserCarId())
                .carModel(userCar.getCarModel())
                .carNumber(userCar.getCarNumber())
                .modelYear(userCar.getModelYear())
                .createdAt(userCar.getCreatedAt())
                .build();
    }
}