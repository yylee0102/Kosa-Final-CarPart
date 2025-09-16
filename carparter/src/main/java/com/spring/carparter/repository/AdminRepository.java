package com.spring.carparter.repository;

import com.spring.carparter.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Admin(관리자) 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 */
@Repository
public interface AdminRepository extends JpaRepository<Admin, String> { // PK 타입을 String으로 수정

    /**
     * 관리자 아이디를 기준으로 계정을 조회합니다.
     * 관리자 로그인 기능에 사용됩니다.
     *
     * @param adminId 관리자 고유 ID
     * @return 관리자 계정 정보 (Optional)
     */
    Optional<Admin> findByAdminId(String adminId);

}