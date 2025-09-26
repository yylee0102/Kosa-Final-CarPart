package com.spring.carparter.dto;

import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCarReqDTO {

    @NotBlank(message = "차량 모델명은 필수입니다.")
    private String carModel;

    @NotBlank(message = "차량 번호는 필수입니다.")
    private String carNumber;

    private Integer modelYear;

    /**
     * DTO를 UserCar 엔티티로 변환하는 메서드
     * @param user 차량의 소유주가 될 User 엔티티
     * @return UserCar 엔티티
     */
    public UserCar toEntity(User user) {
        return UserCar.builder()
                .user(user)
                .carModel(this.carModel)
                .carNumber(this.carNumber)
                .modelYear(this.modelYear)
                .build();
    }
}