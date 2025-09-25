package com.spring.carparter.repository;

import com.spring.carparter.dto.CarCenterApprovalResDTO;
import com.spring.carparter.entity.CarCenterApproval;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarCenterApprovalRepository extends JpaRepository<CarCenterApproval, Long> {

    /**
     * 🔄 [수정] 승인 대기 목록 조회 쿼리
     * JPQL에서 Enum을 비교할 때는 '패키지.클래스.값' 형태가 아닌,
     * Enum 타입 자체와 비교해야 합니다. CarCenter의 status 필드는 CarCenterStatus Enum 타입이므로
     * 'PENDING' 이라는 문자열 값과 직접 비교하도록 수정합니다.
     */
    @Query("""
      select new com.spring.carparter.dto.CarCenterApprovalResDTO(
        c.approvalId,
        c.requestedAt,
        cc.centerId,
        cc.centerName,
        cc.businessRegistrationNumber,
        cc.phoneNumber,
        cc.address,
        cc.status
      )
      from CarCenterApproval c
      join c.carCenter cc
      where cc.status = 'PENDING'
      order by c.requestedAt asc
    """)
    List<CarCenterApprovalResDTO> findPendingApprovals();

    /** 단건 조회 → ResDTO */
    @Query("""
      select new com.spring.carparter.dto.CarCenterApprovalResDTO(
        c.approvalId,
        c.requestedAt,
        cc.centerId,
        cc.centerName,
        cc.businessRegistrationNumber,
        cc.phoneNumber,
        cc.address,
        cc.status
      )
      from CarCenterApproval c
      join c.carCenter cc
      where c.approvalId = :approvalId
    """)
    Optional<CarCenterApprovalResDTO> findApprovalResById(Long approvalId);
}