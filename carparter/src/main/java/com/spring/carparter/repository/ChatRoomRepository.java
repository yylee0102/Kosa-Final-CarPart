package com.spring.carparter.repository;

import com.spring.carparter.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    /**
     *      * 특정 사용자와 카센터, 그리고 특정 견적 요청에 대한 채팅방이 존재하는지 JPQL로 조회합니다.
     * @param userId 사용자 ID
     * @param centerId 카센터 ID
     * @param requestId 견적 요청 ID
     * @return Optional<ChatRoom>
     */
    @Query("SELECT cr FROM ChatRoom cr " +
            "WHERE cr.user.userId = :userId " +
            "AND cr.carCenter.centerId = :centerId " +
            "AND cr.quoteRequest.requestId = :requestId")
    Optional<ChatRoom> findChatRoomByAllIds(@Param("userId") String userId,
                                            @Param("centerId") String centerId,
                                            @Param("requestId") Integer requestId);
}