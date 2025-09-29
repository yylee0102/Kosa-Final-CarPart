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
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:8080")
public class EstimateController {

    private final EstimateService estimateService;

    /**
     * 1. 견적서 제출 API
     * @param req 견적서 생성 정보
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 생성된 견적서 정보
     */
    @PostMapping("/")
    public ResponseEntity<EstimateResDTO> submitEstimate(@RequestBody EstimateReqDTO req,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        // ✅ [수정] try-catch 블록 추가
        // 견적 요청(QuoteRequest)을 찾지 못하는 경우를 대비합니다.
        try {
            String centerId = userDetails.getUsername();
            EstimateResDTO responseDto = estimateService.submitEstimate(centerId, req);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (IllegalArgumentException e) {
            // 연관된 리소스(견적 요청 등)를 찾지 못할 때 발생
            log.error("견적서 제출 실패: {}", e.getMessage());
            throw e; // DefaultExceptionAdvice가 400 Bad Request로 처리
        } catch (Exception e) {
            log.error("견적서 제출 중 서버 오류 발생", e);
            throw e; // DefaultExceptionAdvice가 500 Internal Server Error로 처리
        }
    }

    /**
     * 2. 내가 제출한 견적서 목록 조회 API
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 해당 카센터가 제출한 견적서 목록
     */
    @GetMapping("/my-estimates") // ✅ URL을 kebab-case로 수정
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
     * @param estimateId 조회할 견적서의 ID
     * @return 견적서 상세 정보
     */
    @GetMapping("/{estimateId}")
    public ResponseEntity<EstimateResDTO> getEstimateDetails(@PathVariable Integer estimateId) {
        // ✅ [수정] try-catch 블록 추가
        // ID에 해당하는 견적서가 없을 경우를 처리합니다.
        try {
            EstimateResDTO estimateDetails = estimateService.getEstimateDetails(estimateId);
            return ResponseEntity.ok(estimateDetails);
        } catch (ResourceNotFoundException e) {
            log.warn("견적서 조회 실패: ID {}번 견적서를 찾을 수 없습니다.", estimateId);
            throw e; // DefaultExceptionAdvice가 404 Not Found로 처리
        } catch (Exception e) {
            log.error("견적서 상세 조회 중 서버 오류 발생", e);
            throw e;
        }
    }

    /**
     * 4. 견적서 수정 API
     * @param estimateId 수정할 견적서의 ID
     * @param req 수정할 견적서 정보
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 수정된 견적서 정보
     */
    @PutMapping("/{estimateId}")
    public ResponseEntity<EstimateResDTO> updateEstimate(@PathVariable Integer estimateId,
                                                         @RequestBody EstimateReqDTO req,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        // ✅ [수정] try-catch 블록 추가
        // 권한 문제나 리소스 없음 예외를 처리합니다.
        try {
            String centerId = userDetails.getUsername();
            EstimateResDTO updatedEstimate = estimateService.updateEstimate(estimateId, centerId, req);
            return ResponseEntity.ok(updatedEstimate);
        } catch (ResourceNotFoundException e) {
            log.warn("견적서 수정 실패: ID {}번 견적서를 찾을 수 없습니다.", estimateId);
            throw e; // 404 Not Found
        } catch (SecurityException e) {
            log.warn("견적서 수정 권한 없음: User {}가 견적서 ID {} 수정을 시도했습니다.", userDetails.getUsername(), estimateId);
            throw e; // DefaultExceptionAdvice가 403 Forbidden으로 처리
        } catch (Exception e) {
            log.error("견적서 수정 중 서버 오류 발생", e);
            throw e;
        }
    }

    /**
     * 5. 견적서 삭제 API
     * @param estimateId 삭제할 견적서의 ID
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 성공 시 204 No Content
     */
    @DeleteMapping("/{estimateId}")
    public ResponseEntity<Void> deleteEstimate(@PathVariable Integer estimateId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        // ✅ [수정] try-catch 블록 추가
        // 권한 문제나 리소스 없음 예외를 처리합니다.
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

    /**
     * ✅ [신규 추가] 사용자가 특정 견적 요청에 대해 받은 모든 견적서 목록을 조회하는 API
     */
    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<EstimateResDTO>> getEstimatesForRequest(
            @PathVariable Integer requestId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();
        log.info("===== [API-IN] 받은 견적 목록 조회 요청: 요청 ID '{}', 사용자 ID '{}' =====", requestId, userId);

        // 서비스 레이어에 이 기능을 수행할 메소드가 필요합니다.
        List<EstimateResDTO> estimates = estimateService.getEstimatesForRequest(requestId, userId);

        return ResponseEntity.ok(estimates);
    }
}