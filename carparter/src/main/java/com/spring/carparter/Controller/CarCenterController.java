package com.spring.carparter.controller;

import com.spring.carparter.dto.*;
import com.spring.carparter.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/car-centers")
@CrossOrigin(origins = "http://localhost:8080")
public class CarCenterController {

    private final CarCenterService carCenterService;
    private final ReservationService reservationService;
    private final ReviewReplyService reviewReplyService;
    private final ReviewReportService reviewReportService;
    private final UsedPartService usedPartService;

    // 공통 에러 응답을 생성하는 private 헬퍼 메소드
    private ResponseEntity<Map<String, String>> createErrorResponse(String message, HttpStatus status, Exception e, String logMessage) {
        log.error(logMessage, e);
        return ResponseEntity.status(status).body(Collections.singletonMap("error", message));
    }

    // =================== 1. 카센터 계정 관리 API ===================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CarCenterReqDTO requestDto) {
        try {
            log.info("돌긴해?");
            CarCenterResDTO responseDto = carCenterService.register(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            return createErrorResponse("회원가입 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "카센터 신규 회원가입 중 오류 발생. DTO: " + requestDto.toString());
        }
    }

    @GetMapping("/check-duplicate")
    public ResponseEntity<?> checkDuplicate(@RequestParam("type") String type, @RequestParam("value") String value) {
        try {
            boolean isDuplicate = carCenterService.checkDuplicate(type, value);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("isDuplicate", isDuplicate);
            response.put("message", isDuplicate ?
                    "이미 사용 중인 " + (type.equals("id") ? "아이디" : "사업자 번호") + "입니다." :
                    "사용 가능한 " + (type.equals("id") ? "아이디" : "사업자 번호") + "입니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("중복 검사 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "중복 검사 중 오류 발생. Type: " + type + ", Value: " + value);
        }
    }

    @GetMapping("/{centerId}")
    public ResponseEntity<?> getCarCenter(@PathVariable String centerId) {
        try {
            CarCenterResDTO responseDto = carCenterService.findCarCenterById(centerId);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return createErrorResponse("카센터 정보 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "특정 카센터 정보 조회 중 오류 발생. CenterId: " + centerId);
        }
    }

    @PutMapping("/my-info")
    public ResponseEntity<?> updateMyInfo(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CarCenterReqDTO requestDto) {
        try {
            String centerId = userDetails.getUsername();
            CarCenterResDTO responseDto = carCenterService.update(centerId, requestDto);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return createErrorResponse("내 정보 수정 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "내 정보 수정 중 오류 발생. UserId: " + userDetails.getUsername());
        }
    }

    @DeleteMapping("/{centerId}")
    public ResponseEntity<?> deleteCarCenter(@PathVariable String centerId) {
        try {
            carCenterService.delete(centerId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return createErrorResponse("카센터 회원 탈퇴 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "카센터 회원 탈퇴 중 오류 발생. CenterId: " + centerId);
        }
    }

    // =================== 2. 예약 관리 API ===================

    @PostMapping("/reservations")
    public ResponseEntity<?> createReservation(@RequestBody ReservationReqDTO req, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            ReservationResDTO createdReservation = reservationService.createReservation(centerId, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (Exception e) {
            return createErrorResponse("예약 등록 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "신규 예약 등록 중 오류 발생. CenterId: " + userDetails.getUsername());
        }
    }

    @GetMapping("/reservations/my")
    public ResponseEntity<?> getMyReservations(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            List<ReservationResDTO> myReservations = reservationService.getMyReservations(centerId);
            return ResponseEntity.ok(myReservations);
        } catch (Exception e) {
            return createErrorResponse("예약 목록 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "나의 예약 목록 조회 중 오류 발생. CenterId: " + userDetails.getUsername());
        }
    }

    @PutMapping("/reservations/{reservationId}")
    public ResponseEntity<?> updateReservation(@PathVariable Long reservationId, @RequestBody ReservationReqDTO req) {
        try {
            ReservationResDTO updatedReservation = reservationService.updateReservation(reservationId, req);
            return ResponseEntity.ok(updatedReservation);
        } catch (Exception e) {
            return createErrorResponse("예약 정보 수정 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "예약 정보 수정 중 오류 발생. ReservationId: " + reservationId);
        }
    }

    @DeleteMapping("/reservations/{reservationId}")
    public ResponseEntity<?> deleteReservation(@PathVariable long reservationId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            reservationService.deleteReservation(centerId, reservationId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return createErrorResponse("예약 삭제 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "예약 삭제 중 오류 발생. CenterId: " + userDetails.getUsername() + ", ReservationId: " + reservationId);
        }
    }

    @GetMapping("/today-count")
    public ResponseEntity<?> countTodayReservations(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            long count = reservationService.countTodayReservations(centerId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return createErrorResponse("오늘 예약 건수 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "오늘 예약 건수 조회 중 오류 발생. CenterId: " + userDetails.getUsername());
        }
    }

    // =================== 3. 리뷰 답변 및 신고 API ===================

    @PostMapping("/replies")
    public ResponseEntity<?> createReply(@RequestBody ReviewReplyReqDTO reqDto) {
        try {
            ReviewReplyResDTO responseDto = reviewReplyService.createReply(reqDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            return createErrorResponse("리뷰 답변 생성 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "리뷰 답변 생성 중 오류 발생. DTO: " + reqDto.toString());
        }
    }

    @PutMapping("/replies/{replyId}")
    public ResponseEntity<?> updateReply(@PathVariable Integer replyId, @RequestBody ReviewReplyReqDTO reqDto) {
        try {
            ReviewReplyResDTO updatedDto = reviewReplyService.updateReply(replyId, reqDto);
            return ResponseEntity.ok(updatedDto);
        } catch (Exception e) {
            return createErrorResponse("리뷰 답변 수정 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "리뷰 답변 수정 중 오류 발생. ReplyId: " + replyId);
        }
    }

    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<?> deleteReply(@PathVariable Integer replyId) {
        try {
            reviewReplyService.deleteReply(replyId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return createErrorResponse("리뷰 답변 삭제 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "리뷰 답변 삭제 중 오류 발생. ReplyId: " + replyId);
        }
    }

    @PostMapping("/reports")
    public ResponseEntity<?> createReport(@RequestBody ReviewReportReqDTO reqDto) {
        try {
            ReviewReportResDTO responseDto = reviewReportService.createReport(reqDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            return createErrorResponse("리뷰 신고 생성 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "리뷰 신고 생성 중 오류 발생. DTO: " + reqDto.toString());
        }
    }

    // =================== 4. 중고 부품 관리 API ===================

    @PostMapping(path = "/used-parts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUsedPart(
            @RequestPart("request") UsedPartReqDTO req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            UsedPartResDTO resDTO = usedPartService.registerUsedPart(centerId, req, images);
            return ResponseEntity.status(HttpStatus.CREATED).body(resDTO);
        } catch (Exception e) {
            return createErrorResponse("중고 부품 등록 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "중고 부품 등록 중 예기치 않은 오류 발생. CenterId: " + userDetails.getUsername());
        }
    }

    @GetMapping("/me/used-parts")
    public ResponseEntity<?> getMyUsedParts(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            List<UsedPartResDTO> myParts = usedPartService.getMyUsedParts(centerId);
            return ResponseEntity.ok(myParts);
        } catch (Exception e) {
            return createErrorResponse("내 중고 부품 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "내가 등록한 중고 부품 조회 중 오류 발생. CenterId: " + userDetails.getUsername());
        }
    }

    @GetMapping("/used-parts/{partId}")
    public ResponseEntity<?> getUsedPartDetails(@PathVariable Integer partId) {
        try {
            UsedPartResDTO partDetails = usedPartService.getUsedPartDetails(partId);
            return ResponseEntity.ok(partDetails);
        } catch (Exception e) {
            return createErrorResponse("중고 부품 상세 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "중고 부품 상세 조회 중 오류 발생. PartId: " + partId);
        }
    }

    @PutMapping(value = "/used-parts/{partId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUsedPart(
            @PathVariable Integer partId,
            @RequestPart("request") UsedPartReqDTO requestDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            UsedPartResDTO updatedDto = usedPartService.updateUsedPart(partId, centerId, requestDto, newImages);
            return ResponseEntity.ok(updatedDto);
        } catch (IOException e) {
            return createErrorResponse("중고 부품 수정 중 파일 처리 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "중고 부품 수정 중 IOException 발생. PartId: " + partId + ", CenterId: " + userDetails.getUsername());
        } catch (Exception e) {
            return createErrorResponse("중고 부품 수정 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "중고 부품 수정 중 예기치 않은 오류 발생. PartId: " + partId + ", CenterId: " + userDetails.getUsername());
        }
    }

    @DeleteMapping("/used-parts/{partId}")
    public ResponseEntity<?> deleteUsedPart(
            @PathVariable Integer partId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            usedPartService.deleteUsedPart(partId, centerId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return createErrorResponse("중고 부품 삭제 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR, e, "중고 부품 삭제 중 오류 발생. PartId: " + partId + ", CenterId: " + userDetails.getUsername());
        }
    }
}