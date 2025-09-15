package com.spring.carparter.dto;

import com.spring.carparter.entity.Reservation;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

// 예약 정보를 조회하여 클라이언트에게 보낼 때 사용하는 DTO
@Getter
@Builder
public class ReservationResDTO {
    private Long reservationId;
    private String centerId;

    private String customerName;
    private String customerPhone;
    private String carInfo;
    private LocalDateTime reservationDate;
    private String requestDetails;

    public static ReservationResDTO from(Reservation reservation) {
        return ReservationResDTO.builder()
                .reservationId(reservation.getReservationId())
                .centerId(reservation.getCarCenter().getCenterId())
                .customerName(reservation.getCustomerName())
                .customerPhone(reservation.getCustomerPhone())
                .carInfo(reservation.getCarInfo())
                .reservationDate(reservation.getReservationDate())
                .requestDetails(reservation.getRequestDetails())
                .build();
    }
}