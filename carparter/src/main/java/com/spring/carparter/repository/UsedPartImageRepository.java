package com.spring.carparter.repository;

import com.spring.carparter.entity.UsedPartImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsedPartImageRepository extends JpaRepository<UsedPartImage, Integer> {

    /**
     * 특정 중고 부품 게시글에 포함된 모든 이미지 목록을 조회합니다.
     * @param partId 중고 부품 ID
     * @return 해당 부품의 UsedPartImage 리스트
     */
    List<UsedPartImage> findByUsedPart_PartId(Integer partId);
}