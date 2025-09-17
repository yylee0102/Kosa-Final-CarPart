package com.spring.carparter.repository; // repository 패키지에 생성

import com.spring.carparter.dto.ReviewReportResDTO;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewReportRepository extends JpaRepository<ReviewReport, Integer> {

    /**
     * 특정 상태(status)에 있는 모든 리뷰 신고를 조회합니다.
     * @param status 조회할 신고 처리 상태 (e.g., "PENDING")
     * @return 해당 상태의 신고 목록
     */
    List<ReviewReport> findAllByStatus(String status);

    /**
     * 특정 리뷰(Review)에 대한 모든 신고를 조회합니다.
     * @param review 원본 리뷰 엔티티
     * @return 해당 리뷰에 대한 모든 신고 목록
     */
    List<ReviewReport> findAllByReview(Review review);

    @Query("""
      select new com.spring.carparter.dto.ReviewReportResDTO(r)
      from ReviewReport r
      order by r.createdAt desc
    """)
    List<ReviewReportResDTO> findAllAsResDTO();

    @Query("""
      select new com.spring.carparter.dto.ReviewReportResDTO(r)
      from ReviewReport r
      where r.reportId = :reportId
    """)
    Optional<ReviewReportResDTO> findResDTOById(@Param("reportId") Integer reportId);

}