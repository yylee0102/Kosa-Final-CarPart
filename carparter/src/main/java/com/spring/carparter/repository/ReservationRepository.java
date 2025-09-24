package com.spring.carparter.repository;

import com.spring.carparter.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    /**
     * 특정 카센터의 모든 예약 목록을 JPQL로 조회합니다.
     * @param centerId 카센터의 고유 ID
     * @return 해당 카센터의 Reservation 리스트
     */
    @Query("Select r from Reservation r Where r.carCenter.centerId = :centerId")
    List<Reservation> findAllByCenterId(@Param("centerId") String centerId);

    List<Reservation> findAllByReservationDateBefore(LocalDateTime dateTime);
    //특정 카센터의 오늘 예약 건수 조회(추가/2025.09.22)
    Long countByCarCenterCenterIdAndReservationDateBetween(String centerId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
