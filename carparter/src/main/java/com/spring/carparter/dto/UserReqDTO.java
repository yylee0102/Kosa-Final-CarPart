package com.spring.carparter.dto;

import com.spring.carparter.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserReqDTO {

    private String userId;
    private String password;
    private String name;
    private String phoneNumber;
    private String ssn;
    private boolean marketingAgreed;

    /**
     * UserReq DTO를 User 엔티티로 변환하는 메서드
     * (비밀번호는 서비스 레이어에서 암호화 후 설정하는 것을 권장)
     * @return User 엔티티 객체
     */
    public User toEntity(UserReqDTO dto) {
        return User.builder()
                .userId(dto.userId)
                .password(dto.password) // 주의: 실제 사용 시에는 암호화 필요
                .name(dto.name)
                .phoneNumber(dto.phoneNumber)
                .ssn(dto.ssn)
                .marketingAgreed(dto.marketingAgreed)
                .build();
    }
}