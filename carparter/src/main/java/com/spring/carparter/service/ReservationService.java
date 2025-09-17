package com.spring.carparter.service;

import com.spring.carparter.dto.ReservationReqDTO; // ✅ 통합 DTO 사용
import com.spring.carparter.dto.ReservationResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Reservation;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final CarCenterRepository carCenterRepository;

    // 1. 신규 예약 등록
    @Transactional
    public ReservationResDTO createReservation(String centerId, ReservationReqDTO req) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new IllegalArgumentException("카센터 정보를 찾을 수 없습니다."));

        Reservation reservation = req.toEntity();
        reservation.setCarCenter(carCenter);

        Reservation savedReservation = reservationRepository.save(reservation);
        return ReservationResDTO.from(savedReservation);
    }

    // 2. 우리 카센터의 모든 예약 목록 조회
    @Transactional(readOnly = true)
    public List<ReservationResDTO> getMyReservations(String centerId) {
        List<Reservation> reservations = reservationRepository.findAllByCenterId(centerId);

        return reservations.stream()
                .map(ReservationResDTO::from)
                .collect(Collectors.toList());
    }

    // 3. 예약 정보 수정
    @Transactional
    public ReservationResDTO updateReservation(Long reservationId, ReservationReqDTO requestDto) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 예약 정보를 찾을 수 없습니다."));

        reservation.setCustomerName(requestDto.getCustomerName());
        reservation.setCustomerPhone(requestDto.getCustomerPhone());
        reservation.setCarInfo(requestDto.getCarInfo());
        reservation.setReservationDate(requestDto.getReservationDate());
        reservation.setRequestDetails(requestDto.getRequestDetails());

        return ReservationResDTO.from(reservation);
    }

    // 4. 예약 삭제/취소
    @Transactional
    public void deleteReservation(String centerId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 예약 정보를 찾을 수 없습니다."));

        if (!reservation.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("예약을 삭제할 권한이 없습니다.");
        }

        reservationRepository.delete(reservation);
    }
    @Transactional
    @Scheduled(cron = "0 0 4 * * *")
    public void deleteOldReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> oldReservations = reservationRepository.findAllByReservationDateBefore(now);
        if (!oldReservations.isEmpty()) {
            log.info("[스케줄러] 총 {}개의 오래된 예약을 삭제합니다.", oldReservations.size());
            reservationRepository.deleteAll(oldReservations);
            log.info("[스케줄러] 오래된 예약 삭제 완료.");
        }
    }



}