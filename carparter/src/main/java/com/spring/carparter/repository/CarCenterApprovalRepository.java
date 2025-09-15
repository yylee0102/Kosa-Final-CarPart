package com.spring.carparter.repository;

import com.spring.carparter.entity.CarCenterApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 정비소 가입 승인(CarCenterApproval) 엔티티에 대한 데이터베이스 접근을 처리하는 Repository입니다.
 */
@Repository
public interface CarCenterApprovalRepository extends JpaRepository<CarCenterApproval, Long> {

    /**
     * 아직 처리되지 않은(processedAt이 null인) 모든 가입 신청 목록을 요청된 시간 순서대로 조회합니다.
     * 관리자가 '승인 대기중인 정비소 목록'을 확인할 때 사용됩니다.
     *
     * @return 처리되지 않은 가입 신청(CarCenterApproval) 리스트
     */
    List<CarCenterApproval> findByProcessedAtIsNullOrderByRequestedAtAsc();
}