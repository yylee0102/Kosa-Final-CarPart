package com.spring.carparter.Controller;

import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.service.CarCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // 4. 카센터 정보 수정 API
    @PutMapping("/{centerId}")
    public ResponseEntity<CarCenterResDTO> updateCarCenter(@PathVariable String centerId, @RequestBody CarCenterReqDTO requestDto) {
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

