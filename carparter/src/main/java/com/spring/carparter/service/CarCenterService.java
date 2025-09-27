package com.spring.carparter.service;

import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.dto.Coordinates;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CarCenterApproval;
import com.spring.carparter.exception.DuplicateException;
import com.spring.carparter.repository.CarCenterApprovalRepository;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.CarCenterSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarCenterService {

    private final CarCenterRepository carCenterRepository;
    private final GeocodingService geocodingService;
    private final CarCenterApprovalRepository carCenterApprovalRepository;
    private final PasswordEncoder passwordEncoder; // ✅ 1. PasswordEncoder 의존성 주입



    public List<CarCenterResDTO> searchCenters(String keyword, String category, String district, String sort) {
        // 1. 동적 검색 조건을 만듭니다. (Specification 사용)
        Specification<CarCenter> spec = CarCenterSpecification.isApproved(); // 승인된 카센터만 조회

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and(CarCenterSpecification.containsKeyword(keyword));
        }
        if (district != null && !district.equals("전체")) {
            spec = spec.and(CarCenterSpecification.hasDistrict(district));
        }
        // ... category 필터링도 같은 방식으로 추가할 수 있습니다.

        // 2. 정렬 조건을 만듭니다.
        Sort sortOrder;
        switch (sort) {
            case "review":
                // TODO: 리뷰 개수(totalReviews) 필드가 CarCenter 엔티티에 추가되어야 합니다.
                // sortOrder = Sort.by(Sort.Direction.DESC, "totalReviews");
                sortOrder = Sort.by(Sort.Direction.DESC, "centerId"); // 임시 정렬
                break;
            case "name":
                sortOrder = Sort.by(Sort.Direction.ASC, "centerName");
                break;
            case "rating":
            default:
                // TODO: 평점(rating) 필드가 CarCenter 엔티티에 추가되어야 합니다.
                sortOrder = Sort.by(Sort.Direction.DESC, "centerId"); // 임시 정렬
                break;
        }

        // 3. DB에서 검색 및 정렬 조건으로 데이터를 조회합니다.
        List<CarCenter> centers = carCenterRepository.findAll(spec, sortOrder);

        // 4. DTO로 변환하여 반환합니다.
        return centers.stream()
                .map(CarCenterResDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 1. 카센터 회원가입
     */
    @Transactional
    public CarCenterResDTO register(CarCenterReqDTO requestDto) {
        log.info("========== [START] CarCenter Register Service ==========");
        log.info("요청 데이터: {}", requestDto);

        log.info("1. 아이디 중복 확인 시작: {}", requestDto.getCenterId());
        if (carCenterRepository.existsByCenterId(requestDto.getCenterId())) {
            log.error("아이디 중복 발생: {}", requestDto.getCenterId());
            throw new DuplicateException("이미 사용 중인 아이디입니다.");
        }
        log.info("-> 아이디 사용 가능.");

        log.info("2. 사업자번호 중복 확인 시작: {}", requestDto.getBusinessRegistrationNumber());
        if (carCenterRepository.existsByBusinessRegistrationNumber(requestDto.getBusinessRegistrationNumber())) {
            log.error("사업자번호 중복 발생: {}", requestDto.getBusinessRegistrationNumber());
            throw new DuplicateException("이미 등록된 사업자등록번호입니다.");
        }
        log.info("-> 사업자번호 사용 가능.");

        log.info("3. DTO를 Entity로 변환 시작.");
        CarCenter carCenter = requestDto.toEntity();
        log.info("-> Entity 변환 완료: {}", carCenter.getCenterName());

        log.info("4. 주소 좌표 변환(지오코딩) 시작: {}", requestDto.getAddress());
        try {
            Coordinates coords = geocodingService.getCoordinates(requestDto.getAddress()).block();
            if (coords != null) {
                carCenter.updateCoordinates(coords.getLatitude(), coords.getLongitude());
                log.info("-> 좌표 변환 성공: 위도({}), 경도({})", coords.getLatitude(), coords.getLongitude());
            } else {
                log.warn("-> 좌표를 찾을 수 없음: 주소 - {}", requestDto.getAddress());
            }
        } catch (Exception e) {
            log.error("-> 좌표 변환 중 오류 발생", e);
            // 여기서 에러를 던지지 않고, 좌표 없이 가입을 계속 진행할 수 있습니다.
            // 또는 throw new RuntimeException("좌표 변환 실패"); 와 같이 가입을 중단시킬 수도 있습니다.
        }

        log.info("5. 비밀번호 암호화 시작.");
        carCenter.setPassword(passwordEncoder.encode(requestDto.getPassword()));
        log.info("-> 비밀번호 암호화 완료.");

        log.info("6. DB에 카센터 정보 저장 시작.");
        CarCenter savedCarCenter = carCenterRepository.save(carCenter);
        log.info("-> 카센터 정보 저장 완료: {}", savedCarCenter.getCenterId());

        log.info("7. 승인 정보 생성 및 저장 시작.");
        CarCenterApproval approval = CarCenterApproval.builder()
                .carCenter(savedCarCenter)
                .build();
        carCenterApprovalRepository.save(approval);
        log.info("-> 승인 정보 저장 완료.");

        CarCenterResDTO responseDto = CarCenterResDTO.from(savedCarCenter);
        log.info("========== [SUCCESS] CarCenter Register Service ==========");
        return responseDto;
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
            case "businessNumber": // "bizNum" 등 DB 필드명과 일치하는지 확인 필요
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