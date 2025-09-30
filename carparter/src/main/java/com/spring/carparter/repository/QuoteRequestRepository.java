package com.spring.carparter.repository;

import com.spring.carparter.entity.QuoteRequest;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Integer> {


    @Override
    @EntityGraph(attributePaths = {"user", "userCar"})
    Optional<QuoteRequest> findById(Integer requestId);

    // [삭제] 아래에 동일한 이름의 메소드가 있어 컴파일 오류를 유발하므로 삭제합니다.
    // @Query("SELECT qr FROM QuoteRequest qr JOIN FETCH qr.user u JOIN FETCH qr.userCar uc")
    // List<QuoteRequest> findAllWithDetails();

    //특정 사용자가 작성한 모든 견적 요청 목록을 User, UserCar 정보와 함께 조회합니다.
    @Query("SELECT qr FROM QuoteRequest qr JOIN FETCH qr.user u JOIN FETCH qr.userCar uc WHERE u.id = :userId ORDER BY qr.createdAt DESC")
    List<QuoteRequest> findUserRequestsWithDetails(@Param("userId") String userId);

    /**
     * (핵심 수정 쿼리) 견적 요청 상세 페이지를 위한 데이터를 조회합니다.
     */
    @Query("SELECT DISTINCT qr FROM QuoteRequest qr " +
            "LEFT JOIN FETCH qr.user u " +
            "LEFT JOIN FETCH qr.userCar uc " +
            "LEFT JOIN FETCH qr.requestImages ri " +
            "WHERE qr.requestId = :requestId")
    Optional<QuoteRequest> findByIdWithAllDetails(@Param("requestId") Integer requestId);


    //특정 주소 키워드를 포함하는 모든 견적 요청을 검색합니다.
    List<QuoteRequest> findByAddressContaining(String address);


    //특정 시간 이후에 생성된 모든 견적 요청을 조회합니다.
    List<QuoteRequest> findByCreatedAtAfter(LocalDateTime dateTime);

    // 한 유저에 대한 견적요청서는 한개여야한다.
    Optional<QuoteRequest> findByUser_UserId(String userId);

    /**
     * 모든 견적 요청을 관련 정보(사용자, 차량, 이미지)와 함께 조회합니다.
     */
    @Query("SELECT qr FROM QuoteRequest qr " +
            "JOIN FETCH qr.user u " +
            "JOIN FETCH qr.userCar uc " +
            "LEFT JOIN FETCH qr.requestImages img " +
            "ORDER BY qr.createdAt DESC")
    List<QuoteRequest> findAllWithDetails();


    // ✅ 이 메서드 선언을 추가해주세요.
    boolean existsByUser_UserId(String userId);

    /**
     * ✅ [수정 또는 추가] userId로 견적 요청을 조회할 때,
     * user, userCar, estimates 정보를 한 번의 쿼리로 모두 가져옵니다.
     */
    @Query("SELECT qr FROM QuoteRequest qr " +
            "JOIN FETCH qr.user " +
            "JOIN FETCH qr.userCar " +
            "LEFT JOIN FETCH qr.estimates " + // estimates는 없을 수도 있으니 LEFT JOIN
            "WHERE qr.user.userId = :userId")
    Optional<QuoteRequest> findByUserIdWithDetails(@Param("userId") String userId);
}