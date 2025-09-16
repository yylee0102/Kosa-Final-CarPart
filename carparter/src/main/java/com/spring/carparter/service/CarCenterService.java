package com.spring.carparter.service;

import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.dto.Coordinates;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.exception.DuplicateException;
import com.spring.carparter.repository.CarCenterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // ✅ 임포트 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarCenterService {

    private final CarCenterRepository carCenterRepository;
    private final GeocodingService geocodingService;

    /**
     * 1. 카센터 회원가입 (Create)
     */
    @Transactional
    public CarCenterResDTO register(CarCenterReqDTO requestDto) {
        if (carCenterRepository.existsByCenterId(requestDto.getCenterId())) {
            throw new DuplicateException("이미 사용 중인 이메일입니다.");
        }
        if (carCenterRepository.existsByBusinessRegistrationNumber(requestDto.getBusinessRegistrationNumber())) {
            throw new DuplicateException("이미 등록된 사업자등록번호입니다.");
        }

        CarCenter carCenter = requestDto.toEntity();

        Coordinates coords = geocodingService.getCoordinates(requestDto.getAddress()).block();
        if (coords != null) {
            carCenter.updateCoordinates(coords.getLatitude(), coords.getLongitude());
        }

        /*
         * 비밀번호 암호화 로직
         * carCenter.setPassword(passwordEncoder.encode(requestDto.getPassword()));
         */

        CarCenter savedCarCenter = carCenterRepository.save(carCenter);
        return CarCenterResDTO.from(savedCarCenter);
    }

    /**
     * 2. 카센터 로그인
     */
    @Transactional(readOnly
            = true)
    public CarCenterResDTO login(CarCenterReqDTO req){
        CarCenter carCenter = carCenterRepository.findByCenterId(req.getCenterId())
                .orElseThrow(()-> new IllegalArgumentException("이메일이 일치하지 않습니다."));

        if(!req.getPassword().equals(carCenter.getPassword())){
            /*
              위에랑 바꾸고
             * if(!passwordEncoder.matches(req.getPassword(), carCenter.getPassword())) { ... }
             */
            throw  new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return CarCenterResDTO.from(carCenter);
    }

    /**
     * 3. 특정 카센터 정보 조회
     */
    @Transactional(readOnly = true)
    public CarCenterResDTO findCarCenterById(String centerId) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카센터를 찾을 수 없습니다."));
        return CarCenterResDTO.from(carCenter);
    }

    /**
     * 4. 카센터 정보 수정
     */
    @Transactional
    public CarCenterResDTO update(String centerId, CarCenterReqDTO requestDto) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 카센터를 찾을 수 없습니다. id=" + centerId));

        if (requestDto.getAddress() != null && !requestDto.getAddress().equals(carCenter.getAddress())) {
            Coordinates coords = geocodingService.getCoordinates(requestDto.getAddress()).block();
            if (coords != null) {
                carCenter.updateCoordinates(coords.getLatitude(), coords.getLongitude());
            }
        }

        carCenter.updateInfo(requestDto);

        return CarCenterResDTO.from(carCenter);
    }

    /**
     * 5. 카센터 회원 탈퇴
     */
    @Transactional
    public void delete(String centerId) {
        if (!carCenterRepository.existsById(centerId)) {
            throw new IllegalArgumentException("삭제할 카센터를 찾을 수 없습니다. id=" + centerId);
        }
        carCenterRepository.deleteById(centerId);
    }
}