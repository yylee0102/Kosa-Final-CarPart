package com.spring.carparter.repository;

import com.spring.carparter.entity.CompletedRepair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompletedRepairRepository extends JpaRepository<CompletedRepair, Integer> {

    /**
     * 특정 사용자(User)가 받은 모든 수리 완료 내역 목록을 조회합니다.
     *
     *
     * @param userId 사용자 ID (User 엔티티의 ID 타입에 맞춰야 합니다)
     * @return 해당 사용자의 CompletedRepair 목록
     */
    @Query("SELECT cr FROM CompletedRepair cr " +
            "JOIN FETCH cr.user u " +
            "JOIN FETCH cr.carCenter cc " +
            "JOIN FETCH cr.estimate e " +
            "WHERE u.userId = :userId " +
            "ORDER BY cr.completionDate DESC")
    List<CompletedRepair> findByUser_UserIdWithDetails(@Param("userId") String userId);

    /**
     * 특정 견적서(Estimate)에 대한 수리 완료 내역이 이미 존재하는지 확인합니다.
     * (예: 견적서 하나당 하나의 완료 내역만 생성되도록 검증할 때 사용)
     *
     * @param estimateId 견적서 ID
     * @return 존재 여부 (true/false)
     */
    boolean existsByEstimate_EstimateId(Integer estimateId);

    /**
     * 특정 정비소(CarCenter)에 대한 모든 수리 완료 내역 목록을 조회합니다.
     *
     * @param centerId 정비소 ID (CarCenter의 PK 타입에 맞춰야 합니다)
     * @return 해당 정비소의 CompletedRepair 목록
     */
    List<CompletedRepair> findByCarCenter_CenterId(String centerId);
}