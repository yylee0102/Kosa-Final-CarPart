package com.spring.carparter.repository;

import com.spring.carparter.entity.CompletedRepair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompletedRepairRepository extends JpaRepository<CompletedRepair, Long> {

    /**
     * 특정 사용자의 모든 수리 완료 내역을 조회합니다. (완료 시간 내림차순)
     * @param userId 사용자의 ID
     * @return 해당 사용자의 모든 수리 내역 리스트
     */
    List<CompletedRepair> findByUserIdOrderByCompletedAtDesc(String userId);

    /**
     * 특정 카센터의 모든 수리 완료 내역을 조회합니다. (완료 시간 내림차순)
     * @param carCenterId 카센터의 ID
     * @return 해당 카센터의 모든 수리 내역 리스트
     */
    List<CompletedRepair> findByCarCenterIdOrderByCompletedAtDesc(String carCenterId);

    @Query(value = """
        SELECT cr.original_request_id
        FROM completed_repairs cr
        WHERE cr.id = :repairId
        """, nativeQuery = true)
    Optional<Integer> findRequestIdByRepairIdNative(@Param("repairId") Long repairId);




}
