package com.spring.carparter.dto;

import com.spring.carparter.entity.Reservation;
import lombok.*;
import java.time.LocalDateTime;

// 전화 예약 등 카센터가 직접 예약을 생성할 때 사용하는 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationReqDTO {

    // 사장님이 직접 입력할 고객 이름
    private String customerName;

    // 사장님이 직접 입력할 고객 연락처
    private String customerPhone;

    // 사장님이 직접 입력할 차량 정보
    private String carInfo;

    // 예약 날짜 및 시간
    private LocalDateTime reservationDate;

    // 요청 및 메모 사항
    private String requestDetails;

    public Reservation toEntity() {
        return Reservation.builder()
                .customerName(this.customerName)
                .customerPhone(this.customerPhone)
                .carInfo(this.carInfo)
                .reservationDate(this.reservationDate)
                .requestDetails(this.requestDetails)
                .build();
    }
}