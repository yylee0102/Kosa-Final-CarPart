package com.spring.carparter.repository;

import com.spring.carparter.entity.Review;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {


     // 특정 카센터에 작성된  리뷰 목록을 조회
    @EntityGraph(attributePaths = {"user"})
    List<Review> findByCarCenter_CenterId(String centerId);




}