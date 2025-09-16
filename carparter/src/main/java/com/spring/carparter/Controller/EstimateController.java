package com.spring.carparter.Controller;

import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.service.EstimateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
@Slf4j
public class EstimateController {

    private  final EstimateService estimateService;

//    /**
//     * 1. 견적서 제출 API
//     * @param requestDto 견적서 생성 정보
//     * @param userDetails (인증된 카센터) 사용자 정보
//     * @return 생성된 견적서 정보
//     */
//    @PostMapping
//    public ResponseEntity<?> submitEstimate(@RequestBody EstimateReqDTO req , @AuthenticationPrincipal UserDetails
//
//                                            )


}
