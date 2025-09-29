package com.spring.carparter.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    @Builder.Default
    private boolean isRead = false;

    private String url;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createTime = LocalDateTime.now();

    @Column(name = "receiver_id", nullable = false)
    private String receiverId; // 수신자 ID (user_id 또는 center_id)

    public void markAsRead() {
        this.isRead = true;
    }
}