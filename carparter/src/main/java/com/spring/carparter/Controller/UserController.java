package com.spring.carparter.controller;

import com.spring.carparter.dto.*;
import com.spring.carparter.entity.CsInquiry;
import com.spring.carparter.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users") // 사용자 관련 API 공통 경로
@RequiredArgsConstructor
public class UserController {

    // ✅ 모든 Service 의존성에 final 키워드를 적용하여 생성자 주입이 되도록 보장
    private final UserService userService;
    private final CsInquiryService csInquiryService;
    private final QuoteRequestService quoteRequestService;
    private final ReviewService reviewService;
    private final CompletedRepairService completedRepairService;
    private final EstimateService estimateService;

    // =================== 1. 사용자 프로필 관리 ===================

    @PostMapping("/join") // ✅ 회원가입 경로는 /profile 보다 /join 이 더 명확
    public ResponseEntity<UserResDTO> signUp(@RequestBody UserReqDTO request) {
        UserResDTO userResDTO = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResDTO);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResDTO> updateProfile(@RequestBody UserReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        UserResDTO userResDTO = userService.updateUser(userId, request);
        return ResponseEntity.ok(userResDTO);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> resetPassword(@RequestBody UserReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        // ✅ 로직 수정: 핸드폰 인증이 성공했을 때 비밀번호를 변경하도록 수정
        if (userService.isCorrectPhone(request)) {
            userService.resetPassword(request, userId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/profile") // ✅ PathVariable 대신 인증 정보로 본인 계정 삭제
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // =================== 2. 고객센터 문의 관리 ===================

//    @PostMapping("/inquiries")
//    public ResponseEntity<CsInquiryResDTO> makeInquiry(@RequestBody CsInquiryReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
//        String userId = userDetails.getUsername();
//        // ✅ Service가 Entity 대신 DTO를 반환하도록 수정했다고 가정
//        CsInquiryResDTO newInquiry = csInquiryService.makeCsInquiry(request, userId);
//        return ResponseEntity.status(HttpStatus.CREATED).body(newInquiry);
//    }

    @DeleteMapping("/inquiries/{inquiryId}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Integer inquiryId) {
        csInquiryService.deleteCsInquiry(inquiryId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/inquiries/{inquiryId}")
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

    @DeleteMapping("/quote-requests/{id}")
    public ResponseEntity<Void> deleteQuoteRequest(@PathVariable Integer id) {
        quoteRequestService.deleteQuoteRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-quote-request") // ✅ 더 명확한 경로로 변경
    public ResponseEntity<QuoteRequestResDTO> getMyQuoteRequest(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        // ✅ 불필요한 User 객체 생성 대신 userId(String)를 직접 전달
        QuoteRequestResDTO res = quoteRequestService.getQuoteRequestByUser(userId);
        return ResponseEntity.ok(res);
    }

    // =================== 4. 내가 받은 견적서 관리 ===================

    @PutMapping("/estimates/{estimateId}/reject")
    public ResponseEntity<Void> rejectEstimate(@PathVariable Integer estimateId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        estimateService.rejectEstimateByUser(userId, estimateId);
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

    // =================== 6. 수리 완료 내역 관리 ===================

    @DeleteMapping("/completed-repairs/{id}")
    public ResponseEntity<Void> deleteCompletedRepair(@PathVariable Integer id) {
        completedRepairService.deleteCompletedRepair(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-completed-repairs") // ✅ 더 명확한 경로로 변경
    public ResponseEntity<List<CompletedRepairResDTO>> getMyCompletedRepairList(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<CompletedRepairResDTO> res = completedRepairService.getCompletedRepairListByUserId(userId);
        return ResponseEntity.ok(res);
    }
}