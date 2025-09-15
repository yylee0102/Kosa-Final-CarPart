package com.spring.carparter.repository;

import com.spring.carparter.entity.RequestImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestImageRepository extends JpaRepository<RequestImage, Integer> {

    /**
     * 특정 견적 요청(QuoteRequest) ID에 속한 모든 이미지 목록을
     * @param requestId 이미지를 조회할 견적 요청의 고유 ID
     * @return 해당 ID에 연관된 RequestImage 엔티티의 리스트
     */
    @Query("SELECT ri FROM RequestImage ri WHERE ri.quoteRequest.requestId = :requestId")
    List<RequestImage> findAllByRequestId(@Param("requestId") Integer requestId);
}