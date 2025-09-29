package com.spring.carparter.controller;

import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.dto.EstimateResDTO;
import com.spring.carparter.exception.ResourceNotFoundException;
import com.spring.carparter.service.EstimateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// ✅ [수정] 컨트롤러의 기본 경로를 '/api/car-centers'로 변경하여 다른 API와 일관성을 맞춥니다.
@RequestMapping("/api/car-centers")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:8080")
public class EstimateController {

    private final EstimateService estimateService;

    /**
     * 1. 견적서 제출 API
     * 경로: POST /api/car-centers/estimates
     */
    // ✅ [수정] 경로를 '/estimates'로 지정하여 '/api/car-centers/estimates'가 되도록 합니다.
    @PostMapping("/estimates")
    public ResponseEntity<EstimateResDTO> submitEstimate(@RequestBody EstimateReqDTO req,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            EstimateResDTO responseDto = estimateService.submitEstimate(centerId, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (IllegalArgumentException e) {
            log.error("견적서 제출 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("견적서 제출 중 서버 오류 발생", e);
            throw e;
        }
    }

    /**
     * 2. 내가 제출한 견적서 목록 조회 API
     * 경로: GET /api/car-centers/me/estimates
     */
    // ✅ [수정] 경로를 '/me/estimates'로 변경하여 프론트엔드 호출과 일치시킵니다.
    @GetMapping("/me/estimates")
    public ResponseEntity<List<EstimateResDTO>> getMyEstimates(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            List<EstimateResDTO> myEstimates = estimateService.getMyEstimates(centerId);
            return ResponseEntity.ok(myEstimates);
        } catch (Exception e) {
            log.error("내 견적서 목록 조회 중 서버 오류 발생", e);
            throw e;
        }
    }

    /**
     * 3. 특정 견적서 상세 조회 API
     * 경로: GET /api/car-centers/estimates/{estimateId}
     */
    // ✅ [수정] 경로를 '/estimates/{estimateId}'로 변경합니다.
    @GetMapping("/estimates/{estimateId}")
    public ResponseEntity<EstimateResDTO> getEstimateDetails(@PathVariable Integer estimateId) {
        try {
            EstimateResDTO estimateDetails = estimateService.getEstimateDetails(estimateId);
            return ResponseEntity.ok(estimateDetails);
        } catch (ResourceNotFoundException e) {
            log.warn("견적서 조회 실패: ID {}번 견적서를 찾을 수 없습니다.", estimateId);
            throw e;
        } catch (Exception e) {
            log.error("견적서 상세 조회 중 서버 오류 발생", e);
            throw e;
        }
    }

    /**
     * 4. 견적서 수정 API
     * 경로: PUT /api/car-centers/estimates/{estimateId}
     */
    // ✅ [수정] 경로를 '/estimates/{estimateId}'로 변경합니다.
    @PutMapping("/estimates/{estimateId}")
    public ResponseEntity<EstimateResDTO> updateEstimate(@PathVariable Integer estimateId,
                                                         @RequestBody EstimateReqDTO req,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            EstimateResDTO updatedEstimate = estimateService.updateEstimate(estimateId, centerId, req);
            return ResponseEntity.ok(updatedEstimate);
        } catch (ResourceNotFoundException e) {
            log.warn("견적서 수정 실패: ID {}번 견적서를 찾을 수 없습니다.", estimateId);
            throw e;
        } catch (SecurityException e) {
            log.warn("견적서 수정 권한 없음: User {}가 견적서 ID {} 수정을 시도했습니다.", userDetails.getUsername(), estimateId);
            throw e;
        } catch (Exception e) {
            log.error("견적서 수정 중 서버 오류 발생", e);
            throw e;
        }
    }

    /**
     * 5. 견적서 삭제 API
     * 경로: DELETE /api/car-centers/estimates/{estimateId}
     */
    // ✅ [수정] 경로를 '/estimates/{estimateId}'로 변경합니다.
    @DeleteMapping("/estimates/{estimateId}")
    public ResponseEntity<Void> deleteEstimate(@PathVariable Integer estimateId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String centerId = userDetails.getUsername();
            estimateService.deleteEstimate(centerId, estimateId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            log.warn("견적서 삭제 실패: ID {}번 견적서를 찾을 수 없습니다.", estimateId);
            throw e; // 404 Not Found
        } catch (SecurityException e) {
            log.warn("견적서 삭제 권한 없음: User {}가 견적서 ID {} 삭제를 시도했습니다.", userDetails.getUsername(), estimateId);
            throw e; // 403 Forbidden
        } catch (Exception e) {
            log.error("견적서 삭제 중 서버 오류 발생", e);
            throw e;
        }
    }
}