package com.spring.carparter.repository; // 패키지 경로는 실제 위치에 맞게 수정해주세요.

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CarCenterStatus;
import org.springframework.data.jpa.domain.Specification;

public class CarCenterSpecification {

    /**
     * 승인 상태가 ACTIVE인 카센터만 필터링하는 조건
     */
    public static Specification<CarCenter> isApproved() {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), CarCenterStatus.ACTIVE);
    }

    /**
     * 카센터 이름에 키워드가 포함된 경우를 필터링하는 조건
     * @param keyword 검색할 키워드
     */
    public static Specification<CarCenter> containsKeyword(String keyword) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("centerName"), "%" + keyword + "%");
    }

    /**
     * 주소에 특정 '구'(district)가 포함된 경우를 필터링하는 조건
     * @param district 검색할 지역구 (예: "강남구")
     */
    public static Specification<CarCenter> hasDistrict(String district) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("address"), "%" + district + "%");
    }
}