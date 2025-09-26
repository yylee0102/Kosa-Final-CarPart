package com.spring.carparter.repository;

import com.spring.carparter.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    /**
     * [최적화] 특정 카센터의 모든 예약을 조회할 때,
     * N+1 문제를 방지하기 위해 CarCenter 엔티티를 함께 fetch join 합니다.
     * @param centerId 카센터의 고유 ID
     * @return 해당 카센터의 Reservation 리스트
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.carCenter WHERE r.carCenter.centerId = :centerId")
    List<Reservation> findAllByCenterId(@Param("centerId") String centerId);

    /**
     * 특정 날짜 이전의 모든 예약을 조회합니다. (이름 유지)
     */
    List<Reservation> findAllByReservationDateBefore(LocalDateTime dateTime);

    /**
     * [최적화] 특정 카센터의 오늘 예약 건수를 JPQL로 명확하게 조회합니다.
     * 긴 메서드 이름보다 @Query를 사용하는 것이 가독성과 유지보수에 더 좋습니다.
     */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.carCenter.centerId = :centerId AND r.reservationDate BETWEEN :startOfDay AND :endOfDay")
    Long countByCarCenterCenterIdAndReservationDateBetween(
            @Param("centerId") String centerId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}
