package com.spring.carparter.repository;

import com.spring.carparter.entity.CompletedRepair;
import org.springframework.data.jpa.repository.JpaRepository;

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
}