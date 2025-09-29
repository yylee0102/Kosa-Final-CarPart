package com.spring.carparter.repository;

import com.spring.carparter.entity.CompletedRepair;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompletedRepairRepository extends JpaRepository<CompletedRepair, Integer> {





    /**
     * 특정 정비소(CarCenter)에 대한 모든 수리 완료 내역 목록을 조회합니다.
     *
     * @param centerId 정비소 ID (CarCenter의 PK 타입에 맞춰야 합니다)
     * @return 해당 정비소의 CompletedRepair 목록
     */
    List<CompletedRepair> findByCarCenter_CenterId(String centerId);

    // user, carCenter 를 Fetch Join 하여 N+1 문제가 원래 발생하려던걸 방지 한다.
    @EntityGraph(attributePaths = {"user", "carCenter"})
    List<CompletedRepair> findAllByUser_UserId(String userId);

    /**
     * [신규 추가] 특정 사용자의 모든 수리 완료 내역을 조회합니다.
     * N+1 문제를 방지하기 위해 연관된 엔티티들을 Fetch Join으로 함께 가져옵니다.
     * @param userId 사용자의 ID
     * @return 해당 사용자의 모든 수리 내역 리스트
     */
    @Query("SELECT cr FROM CompletedRepair cr " +
            "JOIN FETCH cr.carCenter " +
            "JOIN FETCH cr.quoteRequest " +
            "WHERE cr.user.userId = :userId " +
            "ORDER BY cr.completedAt DESC")
    List<CompletedRepair> findByUser_UserIdWithDetails(@Param("userId") String userId);

    /**
     * [신규 추가] 특정 카센터의 모든 수리 완료 내역을 조회합니다.
     * N+1 문제를 방지하기 위해 연관된 엔티티들을 Fetch Join으로 함께 가져옵니다.
     * @param centerId 카센터의 ID
     * @return 해당 카센터의 모든 수리 내역 리스트
     */
    @Query("SELECT cr FROM CompletedRepair cr " +
            "JOIN FETCH cr.user " +
            "JOIN FETCH cr.quoteRequest " +
            "WHERE cr.carCenter.centerId = :centerId " +
            "ORDER BY cr.completedAt DESC")
    List<CompletedRepair> findByCarCenter_CenterIdWithDetails(@Param("centerId") String centerId);




}