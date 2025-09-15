package com.spring.carparter.repository;

import com.spring.carparter.entity.Review;


import org.springframework.data.jpa.repository.EntityGraph;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Review 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * 특정 정비소에 작성된 모든 리뷰 목록을 조회합니다.
     * 정비소 상세 정보 페이지에서 리뷰 목록을 보여줄 때 사용됩니다.
     *
     * @param centerId 정비소의 고유 ID
     * @return 해당 정비소의 리뷰(Review) 리스트
     */
    List<Review> findAllByCarCenterCenterId(String centerId);

    /**
     * 특정 사용자가 작성한 모든 리뷰 목록을 조회합니다.
     * '마이페이지 > 내가 쓴 후기'와 같은 기능에서 사용됩니다.
     *
     * @param userId 사용자의 고유 ID
     * @return 해당 사용자가 작성한 리뷰(Review) 리스트
     */
    List<Review> findAllByUserId(String userId);

    // 특정 카센터에 작성된  리뷰 목록을 조회
    @EntityGraph(attributePaths = {"user"})
    List<Review> findByCarCenter_CenterId(String centerId);
}
