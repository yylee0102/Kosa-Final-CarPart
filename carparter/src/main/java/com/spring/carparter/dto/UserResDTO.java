package com.spring.carparter.dto;

import com.spring.carparter.entity.User;
import lombok.Getter;

@Getter
public class UserResDTO {

    private final String userId;
    private final String name;
    private final String phoneNumber;
    private final boolean marketingAgreed;
    // 필요에 따라 UserCar 정보도 DTO로 변환하여 포함할 수 있습니다.
    // private final List<UserCarRes> userCars;

    /**
     * User 엔티티를 UserRes DTO로 변환하는 정적 팩토리 메서드
     * @param user User 엔티티 객체
     * @return UserRes DTO 객체
     */
    public static UserResDTO from(User user) {
        return new UserResDTO(
                user.getUserId(),
                user.getName(),
                user.getPhoneNumber(),
                user.isMarketingAgreed()
                // user.getUserCars().stream().map(UserCarRes::from).collect(Collectors.toList())
        );
    }

    // 생성자는 private으로 선언하여 정적 팩토리 메서드 사용을 강제할 수 있습니다.
    private UserResDTO(String userId, String name, String phoneNumber, boolean marketingAgreed) {
        this.userId = userId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.marketingAgreed = marketingAgreed;
    }
}