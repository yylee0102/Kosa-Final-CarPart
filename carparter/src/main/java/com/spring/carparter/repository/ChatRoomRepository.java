package com.spring.carparter.repository;

import com.spring.carparter.entity.ChatRoom;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.util.List;
import java.util.Optional;

/**
 * ChatRoom 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 * (주의: ChatRoom 엔티티는 제공되지 않아, 일반적인 구조를 가정하여 작성되었습니다.)
 */
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> { // ChatRoom의 PK 타입을 Long으로 가정

    // ▼▼▼ 이 부분을 @EntityGraph에서 @Query를 사용하도록 수정합니다. ▼▼▼
    /**
     * 특정 사용자의 모든 채팅방 목록을 User, CarCenter 정보와 함께 조회합니다. (JOIN FETCH 사용)
     */
    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN FETCH cr.user " +
            "JOIN FETCH cr.carCenter " +
            "WHERE cr.user.userId = :userId")
    List<ChatRoom> findAllByUser_UserId(@Param("userId") String userId);

    /**
     * 특정 카센터의 모든 채팅방 목록을 User, CarCenter 정보와 함께 조회합니다. (JOIN FETCH 사용)
     */
    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN FETCH cr.user " +
            "JOIN FETCH cr.carCenter " +
            "WHERE cr.carCenter.centerId = :centerId")
    List<ChatRoom> findAllByCarCenter_CenterId(@Param("centerId") String centerId);
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    /**
     * 특정 사용자와 정비소, 그리고 견적 요청 건에 해당하는 채팅방이 있는지 조회합니다.
     * 채팅방을 생성하기 전, 중복 생성을 방지하기 위해 사용할 수 있습니다.
     * * @param userId 사용자의 고유 ID
     * @param centerId 정비소의 고유 ID
     * @return 조건에 맞는 채팅방 정보 (Optional)
     */
    @EntityGraph(attributePaths = {"user", "carCenter"})
    Optional<ChatRoom> findByUser_UserIdAndCarCenter_CenterId(
            String userId, String centerId
    );


    /**
     * ✅ [신규 추가] 특정 견적 요청서(quoteRequestId)에 연결된 모든 채팅방을 조회합니다.
     * (주의: ChatRoom 엔티티에 QuoteRequest와의 연관관계 필드가 있어야 합니다.)
     */
    List<ChatRoom> findAllByQuoteRequest_RequestId(Integer quoteRequestId);
}