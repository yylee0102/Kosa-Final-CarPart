package com.spring.carparter.repository;

import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.EstimateItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Integer> {

    // 특정 카센터가 제출한 모든 견적서를 상세 항목과 함께 조회 (N+1 해결)
    /**
     * ✅ [수정된 쿼리]
     * 특정 카센터가 제출한 모든 견적서를 관련 모든 상세 정보와 함께 조회합니다.
     * JOIN FETCH를 사용하여 N+1 문제를 방지합니다.
     */
    @Query("SELECT e FROM Estimate e " +
            "JOIN FETCH e.estimateItems " +
            "JOIN FETCH e.quoteRequest qr " +
            "JOIN FETCH qr.user u " +
            "JOIN FETCH qr.userCar uc " +
            "WHERE e.carCenter.centerId = :centerId " +
            "ORDER BY e.createdAt DESC")
    List<Estimate> findByCarCenter_CenterIdWithDetails(@Param("centerId") String centerId);

    // 특정 견적 요청에 대한 모든 견적서를 상세 항목과 함께 조회 (N+1 해결)
    @Query("SELECT DISTINCT e FROM Estimate e LEFT JOIN FETCH e.estimateItems WHERE e.quoteRequest.requestId = :requestId")
    List<Estimate> findByQuoteRequest_RequestIdWithItems(@Param("requestId") Integer requestId);

    // 특정 견적서 ID로 상세 정보를 조회할 때, 모든 견적 항목을 함께 조회 (N+1 해결)
    @Query("SELECT e FROM Estimate e JOIN FETCH e.estimateItems WHERE e.estimateId = :estimateId")
    Optional<Estimate> findByIdWithItems(@Param("estimateId") Integer estimateId);

    // 특정 견적서 ID와 관련된 모든 견적 항목(EstimateItem)을 조회
    @Query("SELECT ei FROM EstimateItem ei WHERE ei.estimate.estimateId = :estimateId")
    List<EstimateItem> findItemsByEstimateId(@Param("estimateId") Integer estimateId);

    @Query("select e from Estimate e join fetch e.estimateItems")
    List<Estimate> findAllWithItems();
}