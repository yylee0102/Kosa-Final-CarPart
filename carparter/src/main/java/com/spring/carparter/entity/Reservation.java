package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 카센터 사장님이 직접 입력하는 메모장 형태의 예약 엔티티.
 */
@Entity
@Table(name = "reservations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    // 이 예약 메모가 속한 카센터
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;



    // 사장님이 직접 입력하는 고객 이름
    @Column(name = "customer_name", nullable = false)
    private String customerName;

    // 사장님이 직접 입력하는 고객 연락처
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;

    // 사장님이 직접 입력하는 차량 정보
    @Column(name = "car_info", nullable = false)
    private String carInfo;

    // 예약된 정비 날짜와 시간
    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate;

    // 요청 사항 또는 카센터 메모
    @Column(columnDefinition = "TEXT", name = "request_details")
    private String requestDetails;
}