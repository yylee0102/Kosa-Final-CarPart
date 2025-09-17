package com.spring.carparter.controller;


import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.dto.EstimateResDTO;

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
public class EstimateController {

    private final EstimateService estimateService;

    /**
     * 1. 견적서 제출 API
     *
     * @param req  견적서 생성 정보
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 생성된 견적서 정보
     */

    @PostMapping("/")
    public ResponseEntity<EstimateResDTO> submitEstimate(@RequestBody EstimateReqDTO req,
                                                         @AuthenticationPrincipal UserDetails userDetails){
        String centerId = userDetails.getUsername();
        EstimateResDTO responseDto = estimateService.submitEstimate(centerId,req);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

        //내가쓴 목록 조회
    /**
     * 2. 내가 제출한 견적서 목록 조회 API
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 해당 카센터가 제출한 견적서 목록
     */
    @GetMapping("/My-estimates")
    public ResponseEntity<List<EstimateResDTO>> getMyEstimates(@AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        List<EstimateResDTO> myEstimates = estimateService.getMyEstimates(centerId);

        return ResponseEntity.ok(myEstimates);

    }

    //견적서 수정
    /**
     *
     * @param estimateId 수정할 견적서의 ID
     * @param req 수정할 견적서 정보
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 수정된 견적서 정보
     */
    @PutMapping("/{estimateId}")
    public ResponseEntity<EstimateResDTO> updateEstimate(@PathVariable Integer estimateId,
                                                          @RequestBody EstimateReqDTO req,
                                                         @AuthenticationPrincipal UserDetails userDetails){
        String centerId = userDetails.getUsername();
        EstimateResDTO updateEstimate = estimateService.updateEstimate(estimateId,centerId,req);
        return ResponseEntity.ok(updateEstimate);
    }

    /**
     * 특정 견적서 상세 조회 API
     * @param estimateId 조회할 견적서의 ID
     * @return 견적서 상세 정보
     */
    @GetMapping("/{estimateId}")
    public ResponseEntity<EstimateResDTO> getEstimateDetails(@PathVariable Integer estimateId) {
        EstimateResDTO estimateDetails = estimateService.getEstimateDetails(estimateId);
        return ResponseEntity.ok(estimateDetails);
    }
    /**
     * 견적서 삭제 API
     * @param estimateId 삭제할 견적서의 ID
     * @param userDetails (인증된 카센터) 사용자 정보
     * @return 성공 시 204 No Content
     */
    @DeleteMapping("/{estimateId}")
    public ResponseEntity<Void> deleteEstimate(@PathVariable Integer estimateId,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        String centerId = userDetails.getUsername();
        estimateService.deleteEstimate(centerId, estimateId);
        return ResponseEntity.noContent().build();
    }

}

