package com.spring.carparter.repository;

import com.spring.carparter.dto.CarCenterApprovalResDTO;
import com.spring.carparter.entity.CarCenterApproval;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarCenterApprovalRepository extends JpaRepository<CarCenterApproval, Long> {

    /** 승인 대기 목록(관리자 미지정) → ResDTO로 바로 조회, 요청시각 오름차순 */
    @Query("""
      select dto.CarCenterApprovalResDTO(
        c.approvalId, c.requestedAt, cc.centerId, cc.centerName
      )
      from CarCenterApproval c
      join c.carCenter cc
      order by c.requestedAt asc
    """)
    List<CarCenterApprovalResDTO> findPendingApprovalRes();

    /** 단건 조회 → ResDTO */
    @Query("""
      select CarCenterApprovalResDTO(
        c.approvalId, c.requestedAt, cc.centerId, cc.centerName
      )
      from CarCenterApproval c
      join c.carCenter cc
      where c.approvalId = :approvalId
    """)
    Optional<CarCenterApprovalResDTO> findApprovalResById(Long approvalId);
}
