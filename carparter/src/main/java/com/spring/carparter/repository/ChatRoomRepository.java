package com.spring.carparter.repository;

import com.spring.carparter.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ChatRoom 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 * (주의: ChatRoom 엔티티는 제공되지 않아, 일반적인 구조를 가정하여 작성되었습니다.)
 */
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> { // ChatRoom의 PK 타입을 Long으로 가정

    /**
     * 특정 사용자의 모든 채팅방 목록을 조회합니다.
     *
     * @param userId 사용자의 고유 ID
     * @return 해당 사용자가 참여 중인 채팅방(ChatRoom) 리스트
     */
    List<ChatRoom> findAllByUserId(String userId);

    /**
     * 특정 정비소의 모든 채팅방 목록을 조회합니다.
     *
     * @param centerId 정비소의 고유 ID
     * @return 해당 정비소가 참여 중인 채팅방(ChatRoom) 리스트
     */
    List<ChatRoom> findAllByCarCenterCenterId(String centerId);

    /**
     * 특정 사용자와 정비소, 그리고 견적 요청 건에 해당하는 채팅방이 있는지 조회합니다.
     * 채팅방을 생성하기 전, 중복 생성을 방지하기 위해 사용할 수 있습니다.
     * * @param userId 사용자의 고유 ID
     * @param centerId 정비소의 고유 ID
     * @param requestId 견적 요청의 고유 ID
     * @return 조건에 맞는 채팅방 정보 (Optional)
     */
    Optional<ChatRoom> findByUserIdAndCarCenterCenterIdAndQuoteRequestRequestId(String userId, String centerId, Integer requestId);
}