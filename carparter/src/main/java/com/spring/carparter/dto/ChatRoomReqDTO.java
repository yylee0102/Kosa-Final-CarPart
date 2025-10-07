package com.spring.carparter.dto;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.ChatRoom;
import com.spring.carparter.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomReqDTO {
    // 이제 견적서 ID 하나만 받으면 됩니다.
    private Long estimateId; // 견적서의 ID (타입은 실제 Estimate 엔티티의 ID 타입과 일치시키세요)
}