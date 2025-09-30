package com.spring.carparter.controller;

import com.spring.carparter.dto.*;
import com.spring.carparter.entity.CsInquiry;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
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


import java.util.List;

@RestController
@RequestMapping("/api/users") // 사용자 관련 API 공통 경로
@RequiredArgsConstructor
@Slf4j
public class UserController {

    // ✅ 모든 Service 의존성에 final 키워드를 적용하여 생성자 주입이 되도록 보장
    private final UserService userService;
    private final CsInquiryService csInquiryService;
    private final QuoteRequestService quoteRequestService;
    private final ReviewService reviewService;
    private final CompletedRepairService completedRepairService;
    private final EstimateService estimateService;





    // =================== 1. 사용자 프로필 관리 ===================


    @PostMapping("/join")
    public ResponseEntity<UserResDTO> signUp(@RequestBody UserReqDTO request) {
        log.info("===== [API-IN] 사용자 회원가입 요청 =====");
        UserResDTO userResDTO = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResDTO);
    }

    // ✅ [수정] 중복되던 /profile 경로를 하나로 정리했습니다.
    @GetMapping("/profile")
    public ResponseEntity<UserResDTO> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        log.info("===== [API-IN] 내 프로필 조회 요청: 사용자 ID '{}' =====", userId);
        UserResDTO user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResDTO> updateProfile(@RequestBody UserReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        log.info("===== [API-IN] 내 프로필 수정 요청: 사용자 ID '{}' =====", userId);
        UserResDTO userResDTO = userService.updateUser(userId, request);
        return ResponseEntity.ok(userResDTO);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        log.info("===== [API-IN] 회원 탈퇴 요청: 사용자 ID '{}' =====", userId);
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // =================== 2. 고객센터 문의 관리 ===================

    // ▼▼▼▼▼ 이 메소드를 다른 /cs 경로 메소드들과 함께 추가하세요 ▼▼▼▼▼
    /**
     * ✅ [신규 추가] 내 문의 내역 전체를 조회하는 API
     */
    @GetMapping("/cs")
    public ResponseEntity<List<CsInquiryResDTO>> getMyCsInquiries(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        // CsInquiryService에 만든 메소드를 호출합니다.
        List<CsInquiryResDTO> inquiries = csInquiryService.getInquiriesByUserId(userId);
        return ResponseEntity.ok(inquiries);
    }
    // ▲▲▲▲▲ 여기까지 추가 ▲▲▲▲▲

    @PostMapping("/cs")
    public ResponseEntity<CsInquiryResDTO> makeInquiry(@RequestBody CsInquiryReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        // ✅ Service가 Entity 대신 DTO를 반환하도록 수정했다고 가정
        CsInquiryResDTO newInquiry = csInquiryService.makeCsInquiry(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(newInquiry);
    }

    @DeleteMapping("/cs/{inquiryId}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Integer inquiryId) {
        csInquiryService.deleteCsInquiry(inquiryId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/cs/{inquiryId}")
    public ResponseEntity<CsInquiryResDTO> updateQuestion(
            @PathVariable Integer inquiryId,
            @RequestBody CsInquiryReqDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        CsInquiryResDTO updatedInquiry = csInquiryService.updateCsInquiry(inquiryId, request, userId);
        return ResponseEntity.ok(updatedInquiry);
    }

    // =================== 3. 견적 요청서 관리 ===================

//    @PostMapping("/quote-requests")
//    public ResponseEntity<QuoteRequestResDTO> makeQuoteRequest(@RequestBody QuoteRequestReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
//        String userId = userDetails.getUsername();
//        // ✅ 서비스 메서드에 userId를 넘겨주도록 수정
//        QuoteRequestResDTO quoteRequest = quoteRequestService.createAndSaveQuoteRequest(request, userId);
//        return ResponseEntity.status(HttpStatus.CREATED).body(quoteRequest);
//    }


    /**
     * ✅ [신규/수정] 견적 요청 생성 API (이미지 업로드 포함)
     * React에서 보낸 FormData(JSON + 이미지 파일들)를 처리합니다.
     *
     * @param request   견적 요청 정보 (JSON 데이터)
     * @param images    업로드된 이미지 파일 목록
     * @param userDetails 인증된 사용자 정보 (JWT 토큰에서 추출)
     * @return 생성된 견적 요청 정보 (이미지 URL 포함)
     */
    // TODO: [나중에 S3 연동 시 복원] 이미지 업로드 기능
// @PostMapping(value = "/quote-requests", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
// public ResponseEntity<QuoteRequestResDTO> createQuoteRequest(
//         @RequestPart("request") QuoteRequestReqDTO request,
//         @RequestPart(value = "images", required = false) List<MultipartFile> images,
//         @AuthenticationPrincipal UserDetails userDetails) {
//
//     String userId = userDetails.getUsername();
//     QuoteRequestResDTO newQuoteRequest = quoteRequestService.createQuoteRequestWithImages(userId, request, images);
//     return ResponseEntity.status(HttpStatus.CREATED).body(newQuoteRequest);
// }

    /** [임시] 이미지 없는 견적 요청 생성 */
    @PostMapping("/quote-requests")
    public ResponseEntity<QuoteRequestResDTO> createQuoteRequest(
            @RequestBody QuoteRequestReqDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        QuoteRequestResDTO newQuoteRequest = quoteRequestService.createQuoteRequest(userId, request);
        // 아래에서 만들 새 서비스 메서드 호출
        int count = estimateService.countEstimateByUserId(newQuoteRequest.getRequestId());
        newQuoteRequest.setEstimateCount(count);
        return ResponseEntity.status(HttpStatus.CREATED).body(newQuoteRequest);
    }
    @DeleteMapping("/quote-requests/{id}")
    public ResponseEntity<?> deleteQuoteRequest(@PathVariable Integer id) {
        quoteRequestService.deleteQuoteRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-quote-request") // ✅ 더 명확한 경로로 변경
    public ResponseEntity<QuoteRequestResDTO> getMyQuoteRequest(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        QuoteRequestResDTO res = quoteRequestService.getMyQuoteRequest(userId);

        // ✅ [수정] 서비스 결과가 null인지 확인
        if (res == null) {
            // 데이터가 없으면 204 No Content 응답을 보냄
            return ResponseEntity.noContent().build();
        }

        // 데이터가 있을 때만 200 OK와 함께 body를 보냄
        return ResponseEntity.ok(res);
    }

    // =================== 4. 내가 받은 견적서 관리 ===================

    @PutMapping("/estimates/{estimateId}/reject")
    public ResponseEntity<Void> rejectEstimate(@PathVariable Integer estimateId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        estimateService.rejectEstimate(userId, estimateId);
        return ResponseEntity.ok().build();
    }


    /**
     * ✅ [추가] 사용자가 특정 견적을 '수락'하는 API
     * @param estimateId 수락할 견적서의 ID
     * @param userDetails 현재 로그인한 사용자 정보
     * @return 성공 응답
     */
    @PutMapping("/estimates/{estimateId}/accept")
    public ResponseEntity<Void> acceptEstimate(@PathVariable Integer estimateId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        log.info("===== [API-IN] 견적 수락 요청: 사용자 ID '{}', 견적서 ID '{}' =====", userId, estimateId);
        estimateService.acceptEstimate(userId, estimateId);
        return ResponseEntity.ok().build();
    }
    // =================== 5. 리뷰 관리 ===================

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResDTO> makeReview(@RequestBody ReviewReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        ReviewResDTO res = reviewService.createReview(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewResDTO> updateReview(@PathVariable Integer id, @RequestBody ReviewReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        ReviewResDTO res = reviewService.updateReview(id, request, userId);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-reviews") // ✅ 더 명확한 경로로 변경
    public ResponseEntity<List<ReviewResDTO>> getMyReviewList(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<ReviewResDTO> res = reviewService.getReviewListByUserId(userId);
        return ResponseEntity.ok(res);
    }


    /// ============================= 7. 차량 등록

    @PostMapping("/vehicles")
    public ResponseEntity<UserCarResDTO> registerVehicle(
            @RequestBody UserCarReqDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
       UserCarResDTO newVehicle = userService.createCar(request,userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(newVehicle);
    }

    /**
     * ✅ [신규 추가] 등록된 차량 정보를 수정하는 API
     * @param id          경로 변수(Path Variable)로 받은 수정할 차량의 ID
     * @param request     수정할 차량 정보 (모델, 번호, 연식 등)
     * @param userDetails 현재 로그인한 사용자 정보 (본인 차량인지 확인용)
     * @return 수정된 차량 정보
     */
    @PutMapping("/vehicles/{id}")
    public ResponseEntity<UserCarResDTO> updateVehicle(
            @PathVariable Long id,
            @RequestBody UserCarReqDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        UserCarResDTO updatedVehicle = userService.updateCar(id, userId, request);

        return ResponseEntity.ok(updatedVehicle);
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<UserCarResDTO>> getvehicles(@AuthenticationPrincipal UserDetails userDetails){
        String userId = userDetails.getUsername();
        List<UserCarResDTO> vehicles = userService.getMyCars(userId);
        return ResponseEntity.ok(vehicles);
    }
}