package com.spring.carparter.repository;

import com.spring.carparter.entity.UsedPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsedPartRepository extends JpaRepository<UsedPart, Integer> {

    // 특정 카센터가 등록한 모든 중고 부품을 이미지와 함께 조회
    @Query("SELECT DISTINCT up FROM UsedPart up LEFT JOIN FETCH up.images WHERE up.carCenter.centerId = :centerId")
    List<UsedPart> findByCarCenter_CenterIdWithImages(@Param("centerId") String centerId);

    // 특정 중고 부품의 상세 정보를 이미지와 함께 조회
    @Query("SELECT up FROM UsedPart up JOIN FETCH up.images WHERE up.partId = :partId")
    Optional<UsedPart> findByIdWithImages(@Param("partId") Integer partId);
}