// 파일 경로: com/spring/carparter/document/ChatMessageDocument.java
package com.spring.carparter.document;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "messages")
@Builder
public class ChatMessageDocument {
    @Id
    private String id;
    private Integer roomId;
    private String senderId;
    private String senderName;
    private SenderType senderType; // ✅ [추가] 보낸 사람 타입 필드
    private String content;
    private LocalDateTime sentAt;
}