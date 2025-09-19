package com.spring.carparter.service;

import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.dto.Coordinates;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CarCenterApproval;
import com.spring.carparter.exception.DuplicateException;
import com.spring.carparter.repository.CarCenterApprovalRepository;
import com.spring.carparter.repository.CarCenterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarCenterService {

    private final CarCenterRepository carCenterRepository;
    private final GeocodingService geocodingService;
    private final CarCenterApprovalRepository carCenterApprovalRepository;
    private final PasswordEncoder passwordEncoder; // ✅ 1. PasswordEncoder 의존성 주입

    /**
     * 1. 카센터 회원가입
     */
    @Transactional
    public CarCenterResDTO register(CarCenterReqDTO requestDto) {
        if (carCenterRepository.existsByCenterId(requestDto.getCenterId())) {
            throw new DuplicateException("이미 사용 중인 아이디입니다.");
        }
        if (carCenterRepository.existsByBusinessRegistrationNumber(requestDto.getBusinessRegistrationNumber())) {
            throw new DuplicateException("이미 등록된 사업자등록번호입니다.");
        }

        CarCenter carCenter = requestDto.toEntity();

        Coordinates coords = geocodingService.getCoordinates(requestDto.getAddress()).block();
        if (coords != null) {
            carCenter.updateCoordinates(coords.getLatitude(), coords.getLongitude());
        }

        // ✅ 2. 비밀번호를 암호화하여 저장
        carCenter.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        CarCenter savedCarCenter = carCenterRepository.save(carCenter);

        CarCenterApproval approval = CarCenterApproval.builder()
                .carCenter(savedCarCenter)
                .build();
        carCenterApprovalRepository.save(approval);

        return CarCenterResDTO.from(savedCarCenter);
    }

    /**
     * 2. 로그인 메서드 삭제
     * ✅ Spring Security의 LoginFilter와 CustomUserDetailsService가
     * 모든 로그인 처리를 담당하므로 서비스의 login 메서드는 더 이상 필요 없습니다.
     */
    // public CarCenterResDTO login(CarCenterReqDTO req) { ... }

    /**
     * 3. 아이디/사업자번호 중복 확인 (Controller에서 사용하기 위해 추가)
     */
    @Transactional(readOnly = true)
    public boolean checkDuplicate(String type, String value) {
        boolean isDuplicate;
        switch (type) {
            case "id":
                isDuplicate = carCenterRepository.existsByCenterId(value);
                break;
            case "brn": // "bizNum" 등 DB 필드명과 일치하는지 확인 필요
                isDuplicate = carCenterRepository.existsByBusinessRegistrationNumber(value);
                break;
            default:
                throw new IllegalArgumentException("유효하지 않은 중복 확인 타입입니다: " + type);
        }
        return isDuplicate;
    }

    /**
     * 4. 특정 카센터 정보 조회
     */
    @Transactional(readOnly = true)
    public CarCenterResDTO findCarCenterById(String centerId) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카센터를 찾을 수 없습니다."));
        return CarCenterResDTO.from(carCenter);
    }

    /**
     * 5. 카센터 정보 수정
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
     * 6. 카센터 회원 탈퇴
     */
    @Transactional
    public void delete(String centerId) {
        if (!carCenterRepository.existsById(centerId)) {
            throw new IllegalArgumentException("삭제할 카센터를 찾을 수 없습니다. id=" + centerId);
        }
        carCenterRepository.deleteById(centerId);
    }
}