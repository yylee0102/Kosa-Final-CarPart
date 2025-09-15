package com.spring.carparter.repository;

import com.spring.carparter.entity.CarCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CarCenter(정비소) 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 */
@Repository
public interface CarCenterRepository extends JpaRepository<CarCenter, String> {

    /**
     * 이메일을 기준으로 정비소 계정을 조회합니다. (로그인용)
     */
    Optional<CarCenter> findByEmail(String email);

    /**
     * 이메일이 이미 존재하는지 확인합니다. (회원가입 중복 확인용)
     */
    boolean existsByEmail(String email);

    /**
     * 정비소 이름으로 검색합니다. (관리자용)
     */
    List<CarCenter> findByCenterNameContaining(String name);
}