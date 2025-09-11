package com.spring.carparter.entity;

// package com.example.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 채팅방 내의 개별 메시지 정보를 나타내는 엔티티
 */
@Entity
@Table(name = "chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {

    /** 메시지 고유 ID (PK) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    /** 메시지가 속한 채팅방 (ChatRoom) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom chatRoom;

    /** 발신자 유형 (e.g., USER, CENTER) */
    @Column(name = "sender_type")
    private String senderType;

    /** 발신자 ID (user_id 또는 center_id) */
    @Column(name = "sender_id")
    private String senderId;

    /** 메시지 내용 */
    private String message;

    /** 메시지 발신 시간 */
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    /** 수신자 읽음 여부 */
    @Column(name = "is_read")
    private boolean isRead = false;
}