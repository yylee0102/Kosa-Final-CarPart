package com.spring.carparter.entity;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// ChatRoom.java
@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;


    // 👇 1. 채팅의 '주제'를 명확히 하기 위한 필드
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", unique = true) // 하나의 견적서에는 하나의 채팅방만 연결
    private Estimate estimate;

    // 👇 2. 관련된 모든 채팅방을 '그룹화'하고 쉽게 찾기 위한 필드
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quote_request_id")
    private QuoteRequest quoteRequest;

    @LastModifiedDate // @CreatedDate에서 이 애너테이션으로 변경
    @Column(name = "updated_at") // 컬럼명도 updated_at 등으로 바꾸는 것을 권장
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id") // 데이터베이스에 생성될 외래 키 컬럼 이름
    private QuoteRequest quoteRequest;
}
