package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.ChatRoom;
import com.spring.carparter.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomReqDTO {

    private String centerId; // 채팅을 시작할 카센터의 ID
    private String userId;
    /**
     * DTO를 ChatRoom 엔티티로 변환하는 메서드.
     * User와 CarCenter 엔티티는 서비스 계층에서 ID를 이용해 조회 후 주입합니다.
     *
     * @param user      요청한 사용자 엔티티 (보통 Security Context에서 가져옴)
     * @param carCenter 채팅 상대방인 카센터 엔티티
     * @return ChatRoom 엔티티
     */
    public ChatRoom toEntity(User user, CarCenter carCenter) {
        return ChatRoom.builder()
                .user(user)
                .carCenter(carCenter)
                .build();
    }
}