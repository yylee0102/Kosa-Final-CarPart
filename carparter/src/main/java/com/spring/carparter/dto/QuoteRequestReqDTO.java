package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 참고: 이미지 파일(MultipartFile)은 보통 Controller에서 별도로 받아서 처리하므로
// 이 DTO에는 포함하지 않는 것이 일반적입니다.

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuoteRequestReqDTO {

    /** 요청을 보낸 사용자의 ID */
    private String userId;

    /** 견적 대상 차량의 ID */
    private Long userCarId;

    /** 요청 상세 내용 */
    private String requestDetails;

    /** 요청자의 주소 */
    private String address;

    /** 위치기반 서비스를 위한 위도 */
    private Double latitude;

    /** 위치기반 서비스를 위한 경도 */
    private Double longitude;

    public QuoteRequest toEntity(QuoteRequestReqDTO req, User user, UserCar userCar) {
        return QuoteRequest.builder()
                .user(user)
                .userCar(userCar)
                .requestDetails(req.getRequestDetails())
                .address(req.getAddress())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .build();
    }
}