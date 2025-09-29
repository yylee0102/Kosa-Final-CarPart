package com.spring.carparter.controller;

import com.spring.carparter.dto.CompletedRepairResDTO;
import com.spring.carparter.service.CompletedRepairService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class CompletedRepairController {

    private final CompletedRepairService completedRepairService;

    /**
     * (사용자용) 내 수리 완료 내역 목록 조회
     * GET /api/users/my-completed-repairs
     */
    @GetMapping("/api/users/my-completed-repairs")
    public ResponseEntity<List<CompletedRepairResDTO>> getMyCompletedRepairsForUser(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        log.info("===== [API-IN] 사용자 수리 내역 조회 요청: 사용자 ID '{}' =====", userId);
        List<CompletedRepairResDTO> repairs = completedRepairService.getCompletedRepairListByUserId(userId);
        return ResponseEntity.ok(repairs);
    }

    /**
     * (카센터용) 우리 카센터의 수리 완료 내역 목록 조회
     * GET /api/car-centers/my-completed-repairs
     */
    @GetMapping("/api/car-centers/my-completed-repairs")
    public ResponseEntity<List<CompletedRepairResDTO>> getMyCompletedRepairsForCenter(@AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        log.info("===== [API-IN] 카센터 수리 내역 조회 요청: 카센터 ID '{}' =====", centerId);
        List<CompletedRepairResDTO> repairs = completedRepairService.getCompletedRepairListByCenterId(centerId);
        return ResponseEntity.ok(repairs);
    }

    /**
     * (카센터용) 특정 수리를 '완료' 상태로 변경
     * POST /api/completed-repairs/{repairId}/complete
     */
    @PostMapping("/api/completed-repairs/{repairId}/complete")
    public ResponseEntity<Void> markAsCompleted(
            @PathVariable Long repairId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        log.info("===== [API-IN] 수리 완료 처리 요청: 수리 ID '{}', 카센터 ID '{}' =====", repairId, centerId);
        completedRepairService.markAsCompleted(repairId, centerId);
        return ResponseEntity.ok().build();
    }

    /**
     * ✅ [신규 추가] 특정 수리 내역 상세 조회
     * GET /api/completed-repairs/{repairId}
     */
    @GetMapping("/api/completed-repairs/{repairId}")
    public ResponseEntity<CompletedRepairResDTO> getRepairDetails(
            @PathVariable Long repairId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String requesterId = userDetails.getUsername();
        log.info("===== [API-IN] 수리 내역 상세 조회 요청: 수리 ID '{}', 요청자 ID '{}' =====", repairId, requesterId);
        // 서비스 레이어에 권한 검증 로직 포함
        CompletedRepairResDTO repair = completedRepairService.getCompletedRepairDetails(repairId, requesterId);
        return ResponseEntity.ok(repair);
    }




}