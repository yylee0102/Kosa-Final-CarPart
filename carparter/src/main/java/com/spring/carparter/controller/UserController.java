package com.spring.carparter.controller;

import com.spring.carparter.service.EstimateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// UserController.java (예시)
@RestController
@RequestMapping("/api/users") // 사용자 관련 API
@RequiredArgsConstructor
public class UserController {
    private final EstimateService estimateService;
    // ... (다른 서비스들)

    /**
     * 내가 받은 견적서 거절 API
     * @param estimateId 거절할 견적서의 ID
     * @param userDetails 로그인한 사용자 정보
     */
    @PutMapping("/estimates/{estimateId}/reject") // PUT 또는 PATCH 사용
    public ResponseEntity<Void> rejectEstimate(@PathVariable Integer estimateId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        estimateService.rejectEstimateByUser(userId, estimateId);
        return ResponseEntity.ok().build();
    }
}