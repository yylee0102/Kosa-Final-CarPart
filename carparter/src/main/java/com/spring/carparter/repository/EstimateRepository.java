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
    @Query("SELECT DISTINCT e FROM Estimate e " + // 중복 방지를 위해 DISTINCT 추가
            "LEFT JOIN FETCH e.estimateItems " +  // ✅ JOIN을 LEFT JOIN으로 변경
            "JOIN FETCH e.quoteRequest qr " +
            "JOIN FETCH qr.user u " +
            "JOIN FETCH qr.userCar uc " +
            "WHERE e.carCenter.centerId = :centerId " +
            "ORDER BY e.createdAt DESC")
    List<Estimate> findByCarCenter_CenterIdWithDetails(@Param("centerId") String centerId);

    // 특정 견적 요청에 대한 모든 견적서를 상세 항목과 함께 조회 (N+1 해결)
    @Query("SELECT DISTINCT e FROM Estimate e LEFT JOIN FETCH e.estimateItems WHERE e.quoteRequest.requestId = :requestId")
    List<Estimate> findByQuoteRequest_RequestIdWithItems(@Param("requestId") Integer requestId);

    //  JOIN을 LEFT JOIN으로 변경하여 세부 항목이 없어도 견적서를 찾아오도록 수정합니다.
    @Query("SELECT e FROM Estimate e LEFT JOIN FETCH e.estimateItems WHERE e.estimateId = :estimateId")
    Optional<Estimate> findByIdWithItems(@Param("estimateId") Integer estimateId);

    // 특정 견적서 ID와 관련된 모든 견적 항목(EstimateItem)을 조회
    @Query("SELECT ei FROM EstimateItem ei WHERE ei.estimate.estimateId = :estimateId")
    List<EstimateItem> findItemsByEstimateId(@Param("estimateId") Integer estimateId);

    @Query("select e from Estimate e join fetch e.estimateItems")
    List<Estimate> findAllWithItems();

    // ✅ 아래 메소드를 추가합니다.
    // 특정 QuoteRequest ID에 해당하는 Estimate의 개수를 반환합니다.
    Long countByQuoteRequest_RequestId(Integer requestId);

    boolean existsByQuoteRequest_RequestIdAndCarCenter_CenterId(Integer requestId, String centerId);

}