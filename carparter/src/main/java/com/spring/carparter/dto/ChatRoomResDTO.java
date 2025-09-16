package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.ChatRoom;
import com.spring.carparter.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatRoomResDTO {

    private final Integer roomId;
    private final LocalDateTime updatedAt; // 마지막 활동 시간
    private final ParticipantInfo user; // 참여자 정보 1 (사용자)
    private final ParticipantInfo carCenter; // 참여자 정보 2 (카센터)
    // private String lastMessage; // 필요시 마지막 메시지 필드 추가

    // 참여자(User, CarCenter)의 공통 정보를 담는 내부 DTO
    @Getter
    @Builder
    private static class ParticipantInfo {
        private final String id;
        private final String name;
        // private final String profileImageUrl; // 프로필 이미지 URL 등 추가 가능

        // User -> ParticipantInfo 변환
        static ParticipantInfo from(User user) {
            if (user == null) return null;
            return ParticipantInfo.builder()
                    .id(user.getUserId())
                    .name(user.getName())
                    .build();
        }

        // CarCenter -> ParticipantInfo 변환
        static ParticipantInfo from(CarCenter carCenter) {
            if (carCenter == null) return null;
            return ParticipantInfo.builder()
                    .id(String.valueOf(carCenter.getCenterId())) // ID 타입을 String으로 통일
                    .name(carCenter.getCenterName()) // getCenterName()은 예시입니다.
                    .build();
        }
    }

    /**
     * ChatRoom 엔티티를 ChatRoomRes DTO로 변환하는 정적 팩토리 메서드
     */
    public static ChatRoomResDTO from(ChatRoom chatRoom) {
        return ChatRoomResDTO.builder()
                .roomId(chatRoom.getRoomId())
                .updatedAt(chatRoom.getUpdatedAt())
                .user(ParticipantInfo.from(chatRoom.getUser()))
                .carCenter(ParticipantInfo.from(chatRoom.getCarCenter()))
                .build();
    }
}