package com.spring.carparter.controller;

import com.spring.carparter.dto.ReservationReqDTO;
import com.spring.carparter.dto.ReservationResDTO;
import com.spring.carparter.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

        //신규 예약 등록
    /**
     * 1. 신규 예약 등록 API
     * @param req 예약 생성 정보 DTO
     * @param userDetails 인증된 정비소 사용자 정보 (로그인한 CarCenter의 정보)
     * @return 생성된 예약 정보 DTO
     */
    @PostMapping("/")
    public ResponseEntity<ReservationResDTO> createReservation(@RequestBody ReservationReqDTO req,
                                                  @AuthenticationPrincipal UserDetails userDetails){


        String centerId = userDetails.getUsername();
        ReservationResDTO creatdReservation = reservationService.createReservation(centerId,req);
        return ResponseEntity.status(HttpStatus.CREATED).body(creatdReservation);
                    // status부분에 201 Created로 설정
    }

    //해당 정비소의 모든 예약 목록
    /**
     * 2. 나의 모든 예약 목록 조회
     * @param userDetails 인증된 정비소 사용자 정보
     * @return 해당 정비소의 모든 예약 목록
     */
    @GetMapping("/my-reservations")
   public ResponseEntity<List<ReservationResDTO>> getMyReservations( @AuthenticationPrincipal UserDetails userDetails){
        String centerId = userDetails.getUsername();
        List<ReservationResDTO> myResrvations = reservationService.getMyReservations(centerId);
        return ResponseEntity.ok(myResrvations);
    }

    //예약정보 수정
    /**
     * 3. 예약 정보 수정 API
     * @param reservationId 수정할 예약의 ID
     * @param req 수정할 예약 정보 DTO
     * @return 수정된 예약 정보 DTO
     */
    @PutMapping("/reservationId")
    public ResponseEntity<ReservationResDTO> updateReservation(@PathVariable Long reservationId,
                                                               @RequestBody ReservationReqDTO req
                                                              ){
        ReservationResDTO updateResrvation = reservationService.updateReservation(reservationId,req);
        return ResponseEntity.ok(updateResrvation);

    }
    //에약 삭제
    /**
     * 4. 예약 삭제 API
     * @param reservationId 삭제할 예약의 ID
     * @param userDetails 인증된 정비소 사용자 정보
     * @return 성공 시 204 No Content
     */
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable long reservationId,
                                                  @AuthenticationPrincipal UserDetails userDetails) {

        String centerId = userDetails.getUsername();
        reservationService.deleteReservation(centerId, reservationId); // 'reservationId'로 수정

        return ResponseEntity.noContent().build();
    }


}
