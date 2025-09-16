package com.spring.carparter.repository;

import com.spring.carparter.entity.CarCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarCenterRepository extends JpaRepository<CarCenter, String> {

    /**
     * 로그인 ID로 카센터 조회
     * @param CenterId 로그인 ID
     * @return Optional<CarCenter>
     */
    Optional<CarCenter> findByCenterId(String CenterId);

    /**
     * 회원가입 시 로그인 ID 중복 검사
     * @param CenterId 로그인 ID
     * @return boolean
     */
    boolean existsByCenterId(String CenterId);

    /**
     * 사업자 등록 번호 중복 검사
     */
    boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);
}