package com.spring.carparter.Controller;

import com.spring.carparter.document.ChatMessageDocument;
import com.spring.carparter.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatHistoryController {

    private final ChatMessageRepository chatMessageRepository;

    /**
     * 특정 채팅방의 이전 대화 내역을 조회하는 API
     * @param roomId 조회할 채팅방의 ID
     * @return 해당 채팅방의 메시지 목록
     */
    @GetMapping("/api/chat/history/{roomId}")
    public ResponseEntity<List<ChatMessageDocument>> getChatHistory(@PathVariable Integer roomId) {
        List<ChatMessageDocument> history = chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
        return ResponseEntity.ok(history);
    }
}