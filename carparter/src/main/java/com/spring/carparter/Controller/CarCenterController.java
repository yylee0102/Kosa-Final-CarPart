package com.spring.carparter.controller;

import com.spring.carparter.dto.*;
import com.spring.carparter.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/car-centers") // 카센터 관련 API의 공통 경로
public class CarCenterController {

    // 필요한 모든 Service를 주입받습니다.
    private final CarCenterService carCenterService;
    private final ReservationService reservationService;
    private final ReviewReplyService reviewReplyService;
    private final ReviewReportService reviewReportService;
    private final UsedPartService usedPartService;

    // =================== 1. 카센터 계정 관리 API ===================

    /** 1-1. 카센터 신규 회원가입 */
    @PostMapping("/register")
    public ResponseEntity<CarCenterResDTO> register(@RequestBody CarCenterReqDTO requestDto) {
        CarCenterResDTO responseDto = carCenterService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /** 1-2. 아이디 또는 사업자 등록번호 중복 검사 */
    @GetMapping("/check-duplicate")
    public ResponseEntity<Map<String, Object>> checkDuplicate(@RequestParam("type") String type, @RequestParam("value") String value) {
        boolean isDuplicate = carCenterService.checkDuplicate(type, value);
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("isDuplicate", isDuplicate);
        if (isDuplicate) {
            response.put("message", "이미 사용 중인 " + (type.equals("id") ? "아이디" : "사업자 번호") + "입니다.");
        } else {
            response.put("message", "사용 가능한 " + (type.equals("id") ? "아이디" : "사업자 번호") + "입니다.");
        }
        return ResponseEntity.ok(response);
    }

    /** 1-3. 특정 카센터 정보 조회 */
    @GetMapping("/{centerId}")
    public ResponseEntity<CarCenterResDTO> getCarCenter(@PathVariable String centerId) {
        CarCenterResDTO responseDto = carCenterService.findCarCenterById(centerId);
        return ResponseEntity.ok(responseDto);
    }

    /** 1-4. 내 정보 수정 (로그인 필요) */
    @PutMapping("/my-info")
    public ResponseEntity<CarCenterResDTO> updateMyInfo(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CarCenterReqDTO requestDto) {
        String centerId = userDetails.getUsername();
        CarCenterResDTO responseDto = carCenterService.update(centerId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    /** 1-5. 카센터 회원 탈퇴 */
    @DeleteMapping("/{centerId}")
    public ResponseEntity<Void> deleteCarCenter(@PathVariable String centerId) {
        carCenterService.delete(centerId);
        return ResponseEntity.noContent().build();
    }

    // =================== 2. 예약 관리 API ===================

    /** 2-1. 신규 예약 등록 (로그인 필요) */
    @PostMapping("/reservations")
    public ResponseEntity<ReservationResDTO> createReservation(@RequestBody ReservationReqDTO req, @AuthenticationPrincipal UserDetails userDetails){
        String centerId = userDetails.getUsername();
        ReservationResDTO createdReservation = reservationService.createReservation(centerId,req);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
    }

    /** 2-2. 나의 모든 예약 목록 조회 (로그인 필요) */
    @GetMapping("/reservations/my")
    public ResponseEntity<List<ReservationResDTO>> getMyReservations(@AuthenticationPrincipal UserDetails userDetails){
        String centerId = userDetails.getUsername();
        List<ReservationResDTO> myReservations = reservationService.getMyReservations(centerId);
        return ResponseEntity.ok(myReservations);
    }

    /** 2-3. 예약 정보 수정 */
    @PutMapping("/reservations/{reservationId}")
    public ResponseEntity<ReservationResDTO> updateReservation(@PathVariable Long reservationId, @RequestBody ReservationReqDTO req){
        ReservationResDTO updatedReservation = reservationService.updateReservation(reservationId,req);
        return ResponseEntity.ok(updatedReservation);
    }

    /** 2-4. 예약 삭제 (로그인 필요) */
    @DeleteMapping("/reservations/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable long reservationId, @AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        reservationService.deleteReservation(centerId, reservationId);
        return ResponseEntity.noContent().build();
    }

    // =================== 3. 리뷰 답변 및 신고 API ===================

    /** 3-1. 리뷰 답변 생성 (로그인 필요) */
    @PostMapping("/replies")
    public ResponseEntity<ReviewReplyResDTO> createReply(@RequestBody ReviewReplyReqDTO reqDto) {
        ReviewReplyResDTO responseDto = reviewReplyService.createReply(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /** 3-2. 리뷰 답변 수정 (로그인 필요) */
    @PutMapping("/replies/{replyId}")
    public ResponseEntity<ReviewReplyResDTO> updateReply(@PathVariable Integer replyId, @RequestBody ReviewReplyReqDTO reqDto) {
        ReviewReplyResDTO updatedDto = reviewReplyService.updateReply(replyId, reqDto);
        return ResponseEntity.ok(updatedDto);
    }

    /** 3-3. 리뷰 답변 삭제 (로그인 필요) */
    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Integer replyId) {
        reviewReplyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }

    /** 3-4. 리뷰 신고 생성 (로그인 필요) */
    @PostMapping("/reports")
    public ResponseEntity<ReviewReportResDTO> createReport(@RequestBody ReviewReportReqDTO reqDto) {
        ReviewReportResDTO responseDto = reviewReportService.createReport(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // =================== 4. 중고 부품 관리 API ===================

    /** 4-1. 중고 부품 등록 (로그인 필요) */
    @PostMapping(path = "/used-parts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsedPartResDTO> registerUsedPart(
            @RequestPart("request") UsedPartReqDTO req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        String centerId = userDetails.getUsername();
        UsedPartResDTO resDTO = usedPartService.registerUsedPart(centerId, req, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(resDTO);
    }

    /** 4-2. 내가 등록한 모든 중고 부품 조회 (로그인 필요) */
    @GetMapping("/me/used-parts")
    public ResponseEntity<List<UsedPartResDTO>> getMyUsedParts(@AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        List<UsedPartResDTO> myParts = (List<UsedPartResDTO>) usedPartService.getMyUsedParts(centerId);
        return ResponseEntity.ok(myParts);
    }

    /** 4-3. 중고 부품 상세 조회 */
    @GetMapping("/used-parts/{partId}")
    public ResponseEntity<UsedPartResDTO> getUsedPartDetails(@PathVariable Integer partId) {
        UsedPartResDTO partDetails = usedPartService.getUsedPartDetails(partId);
        return ResponseEntity.ok(partDetails);
    }

    /** 4-4. 중고 부품 수정 (로그인 필요) */
    @PutMapping(value = "/used-parts/{partId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsedPartResDTO> updateUsedPart(
            @PathVariable Integer partId,
            @RequestPart("request") UsedPartReqDTO requestDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        String centerId = userDetails.getUsername();
        UsedPartResDTO updatedDto = usedPartService.updateUsedPart(partId, centerId, requestDto, newImages);
        return ResponseEntity.ok(updatedDto);
    }

    /** 4-5. 중고 부품 삭제 (로그인 필요) */
    @DeleteMapping("/used-parts/{partId}")
    public ResponseEntity<Void> deleteUsedPart(
            @PathVariable Integer partId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        usedPartService.deleteUsedPart(partId, centerId);
        return ResponseEntity.noContent().build();
    }
}