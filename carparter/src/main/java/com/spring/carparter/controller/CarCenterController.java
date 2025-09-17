package com.spring.carparter.controller;

import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.service.CarCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/car-centers") // API의 공통 경로 설정
public class CarCenterController {

    private final CarCenterService carCenterService;

    // 1. 회원가입 API
    @PostMapping("/register")
    public ResponseEntity<CarCenterResDTO> register(@RequestBody CarCenterReqDTO requestDto) {
        CarCenterResDTO responseDto = carCenterService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // 2. 로그인 API
    @PostMapping("/login")
    public ResponseEntity<CarCenterResDTO> login(@RequestBody CarCenterReqDTO requestDto) {
        CarCenterResDTO responseDto = carCenterService.login(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 3. 특정 카센터 정보 조회 API
    @GetMapping("/{centerId}")
    public ResponseEntity<CarCenterResDTO> getCarCenter(@PathVariable String centerId) {
        CarCenterResDTO responseDto = carCenterService.findCarCenterById(centerId);
        return ResponseEntity.ok(responseDto);
    }

    /**
     * 현재 로그인된 정비소의 정보를 수정합니다.
     * @param userDetails (인증된 카센터) 사용자 정보
     * @param requestDto 수정할 정보 DTO
     * @return 수정된 나의 상세 정보
     */
    @PutMapping("/my-info")
    public ResponseEntity<CarCenterResDTO> updateMyInfo(@AuthenticationPrincipal UserDetails userDetails,
                                                        @RequestBody CarCenterReqDTO requestDto) {
        String centerId = userDetails.getUsername(); // 토큰에서 내 ID를 안전하게 가져옴
        CarCenterResDTO responseDto = carCenterService.update(centerId, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 5. 카센터 회원 탈퇴 API
    @DeleteMapping("/{centerId}")
    public ResponseEntity<Void> deleteCarCenter(@PathVariable String centerId) {
        carCenterService.delete(centerId);
        return ResponseEntity.noContent().build(); // 내용 없이 성공 상태만 반환
    }
}

