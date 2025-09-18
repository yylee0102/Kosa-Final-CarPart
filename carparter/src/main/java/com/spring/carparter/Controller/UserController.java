package com.spring.carparter.controller;

import com.spring.carparter.dto.*;
import com.spring.carparter.entity.*;
import com.spring.carparter.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/")
public class UserController {

    private final UserService userService;
    /************* 유저 프로필 관련 유저 ************************/
    @PostMapping("/profile")
    public ResponseEntity<UserResDTO> signUp(@RequestBody UserReqDTO request) {
        UserResDTO userResDTO = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResDTO);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResDTO> updateProfile(@RequestBody UserReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        UserResDTO userResDTO = userService.updateUser(userId,request);
        return ResponseEntity.status(HttpStatus.OK).body(userResDTO);
    }

    // 비밀번호 찾기
    @PutMapping("/password")
    public ResponseEntity<Void> resetPassword(@RequestBody UserReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        if(!userService.isCorrectPhone(request)){
            userService.resetPassword(request,userId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/profile/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }





    private final CsInquiryService csInquiryService;
/***************** 고객센터 질문에 대한 유저 *******************/

    // 질문 생성
    @PostMapping("/inquiry")
    public ResponseEntity<CsInquiry> makeInquiry(@RequestBody CsInquiryReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        CsInquiry css = csInquiryService.makeCsInquiry(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(css);
    }

    @DeleteMapping("/inquiry/{inquiryId}")
    public ResponseEntity<?> deleteInquiry(@PathVariable Integer inquiryId) {
        csInquiryService.deleteCsInquiry(inquiryId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/inquiry/{inquiryId}")
    public ResponseEntity<CsInquiryResDTO> updateQuestion(
            @PathVariable Integer inquiryId,
            @RequestBody CsInquiryReqDTO request, // 질문만 수정
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        CsInquiryResDTO updatedInquiry = csInquiryService.updateCsInquiry(inquiryId, request, userId);
        return ResponseEntity.ok(updatedInquiry);
    }


private final QuoteRequestService quoteRequestService;
/***************** 견적 요청서에 대한 유저 *******************/
    @PostMapping("/quote")
    public ResponseEntity<QuoteRequestResDTO> makeQuoteRequest(@RequestBody QuoteRequestReqDTO request) {
        QuoteRequest quoteRequest = quoteRequestService.createAndSaveQuoteRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(QuoteRequestResDTO.from(quoteRequest));
    }

    @DeleteMapping("/quote/{id}")
    public ResponseEntity<?> deleteQuoteRequest(@PathVariable Integer id) {
        quoteRequestService.deleteQuoteRequest(id);
        return ResponseEntity.noContent().build();
    }

    // 한 유저는 한 번의 요청서를 보낼 수 있다.
    @GetMapping("/quote")
    public ResponseEntity<?> getQuoteRequests(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        QuoteRequestResDTO res = quoteRequestService.getQuoteRequestByUser(new User().builder().userId(userId).build());
        return ResponseEntity.ok(res);
    }

    private final ReviewService reviewService;
    /*********************** 후기 생성  ***************************/
    @PostMapping("/review")
    public ResponseEntity<ReviewResDTO> makeReview(@RequestBody ReviewReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        ReviewResDTO res = reviewService.createReview(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/review/{id}")
    public ResponseEntity<ReviewResDTO> updateReview(@PathVariable Integer id, @RequestBody ReviewReqDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        ReviewResDTO res = reviewService.updateReview(id, request, userId);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/review/")
    public ResponseEntity<?> getReviewList(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<ReviewResDTO> res = reviewService.getReviewListByUserId(userId);
        return ResponseEntity.ok(res);
    }

    private CompletedRepairService completedRepairService;
    /******************************유저 입장에서의 완료된 견적 ******************************/
    @DeleteMapping("/completedRepair/{id}")
    public ResponseEntity<?> deleteCompletedRepair(@PathVariable Integer id) {
        completedRepairService.deleteCompletedRepair(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/completedRepair/")
    public ResponseEntity<?> getCompletedRepairList(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<CompletedRepairResDTO> res = completedRepairService.getCompletedRepairListByUserId(userId);
        return ResponseEntity.ok(res);
    }



}
