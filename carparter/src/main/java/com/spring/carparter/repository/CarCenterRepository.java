package com.spring.carparter.repository;

import com.spring.carparter.entity.CarCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CarCenterRepository extends JpaRepository<CarCenter, String> , JpaSpecificationExecutor<CarCenter> {

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


    @Query("SELECT DISTINCT cc FROM CarCenter cc LEFT JOIN FETCH cc.estimates")
    List<CarCenter> findAllWithDetails();




}