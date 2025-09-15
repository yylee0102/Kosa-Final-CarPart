package com.spring.carparter.repository;

import com.spring.carparter.entity.CarCenter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarCenterRepository extends JpaRepository<CarCenter,String> {

    //CarCenter


    //로그인 ID 검색
    Optional<CarCenter> findByEmail(String email);

    //회원가입시 이메일 중복 검사
    boolean existsByEmail(String email);

    //특정 사업자 등록 번호 검색 (중복 검색)
    boolean existsByBusinessRegistrationNumber(String businessRegistrationNumber);

}
