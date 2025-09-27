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


    /**
     * 모든 견적 요청을 연관된 User, UserCar 정보와 함께 조회합니다. (N+1 문제 해결)
     */
    @Query("SELECT qr FROM QuoteRequest qr JOIN FETCH qr.user u JOIN FETCH qr.userCar uc")
    List<QuoteRequest> findAllWithDetails();

    //특정 사용자가 작성한 모든 견적 요청 목록을 User, UserCar 정보와 함께 조회합니다.
    @Query("SELECT qr FROM QuoteRequest qr JOIN FETCH qr.user u JOIN FETCH qr.userCar uc WHERE u.id = :userId ORDER BY qr.createdAt DESC")
    List<QuoteRequest> findUserRequestsWithDetails(@Param("userId") String userId);

    /**
     * (핵심 수정 쿼리) 견적 요청 상세 페이지를 위한 데이터를 조회합니다.
     * <b>[전략]</b> MultipleBagFv etchException을 피하기 위해 이 쿼리는 'requestImages' 컬렉션 하나만 직접 가져옵니다.
     * <b>[@BatchSize와의 연계]</b> 나머지 컬렉션들(estimates, chatRooms 등)은 일부러 JOIN FETCH에서 제외했습니다.
     * 이것들은 QuoteRequest 엔티티에 설정된 <b>@BatchSize</b> 덕분에, 나중에 지연 로딩될 때 IN절을 사용하는
     * 단 한 번의 추가 쿼리로 효율적으로 조회되므로 N+1 문제도 함께 해결됩니다.

     */
    @Query("SELECT DISTINCT qr FROM QuoteRequest qr " +
            "LEFT JOIN FETCH qr.user u " +
            "LEFT JOIN FETCH qr.userCar uc " +
            "LEFT JOIN FETCH qr.requestImages ri " + // 컬렉션은 하나만 JOIN FETCH!
            "WHERE qr.requestId = :requestId")
    Optional<QuoteRequest> findByIdWithAllDetails(@Param("requestId") Integer requestId);


     //특정 주소 키워드를 포함하는 모든 견적 요청을 검색합니다.

    List<QuoteRequest> findByAddressContaining(String address);


     //특정 시간 이후에 생성된 모든 견적 요청을 조회합니다.

    List<QuoteRequest> findByCreatedAtAfter(LocalDateTime dateTime);

    // 한 유저에 대한 견적요청서는 한개여야한다.
    Optional<QuoteRequest> findByUser_UserId(String userId);

    /**
     * ✅ [수정] 모든 견적 요청을 관련 정보(사용자, 차량, 이미지)와 함께 조회합니다.
     */
    @Query("SELECT qr FROM QuoteRequest qr " +
            "JOIN FETCH qr.user u " +
            "JOIN FETCH qr.userCar uc " +
            "LEFT JOIN FETCH qr.requestImages img " + // 이미지가 없는 요청도 있을 수 있으므로 LEFT JOIN
            "ORDER BY qr.createdAt DESC")
    List<QuoteRequest> findAllWithDetails();
}