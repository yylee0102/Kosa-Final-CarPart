package com.spring.carparter.repository;

import com.spring.carparter.document.ChatMessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessageDocument, String> {
    // 특정 채팅방의 메시지를 시간순으로 조회하는 메서드
    List<ChatMessageDocument> findByRoomIdOrderBySentAtAsc(Integer roomId);

    /**
     * ✅ [신규 추가] 특정 채팅방(roomId)에 속한 모든 메시지를 삭제합니다.
     */
    void deleteByRoomId(Integer roomId);
}