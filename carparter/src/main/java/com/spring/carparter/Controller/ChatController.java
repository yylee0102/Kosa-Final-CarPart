// 파일 경로: com/spring/carparter/Controller/ChatController.java
package com.spring.carparter.controller;

import com.spring.carparter.document.ChatMessageDocument;
import com.spring.carparter.document.SenderType;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.dto.UserResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ChatMessageRepository;
import com.spring.carparter.repository.UserRepository;
import com.spring.carparter.security.CustomUserDetails;
import com.spring.carparter.service.CarCenterService;
import com.spring.carparter.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;


import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    // ✅ [추가] 이름 조회를 위해 UserRepository와 CarCenterRepository를 주입받습니다.
    private final UserRepository userRepository;
    private final CarCenterRepository carCenterRepository;
    private final CarCenterService carCenterService;
    private final UserService userService;


    @MessageMapping("/chat/send/{roomId}")
    public void sendMessage(
            @DestinationVariable Integer roomId,
            @Payload ChatMessageDocument incoming,// 클라이언트가 보낸 메시지 내용
            Principal principal  // 접속한 사용자의 인증 정보
    ) {
        // 1. 접속자 정보에서 실제 로그인 정보를 가져옵니다.
        Authentication auth = (Authentication) principal;
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();

        // 1) 권한으로 역할 판별 (ROLE_ 접두 유무 모두 허용)
        SenderType senderType = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_CAR_CENTER") || a.equals("CAR_CENTER"))
                ? SenderType.CAR_CENTER : SenderType.USER;

        // 2) 신뢰 가능한 값만 채택 (content만 사용)
        String content = incoming.getContent(); // 프론트에서 보낸 본문만

        // 3) 서버가 최종 값 구성
        ChatMessageDocument toSave = ChatMessageDocument.builder()
                .roomId(roomId)
                .senderId(user.getUsername())
                .senderName(resolveSenderName(user, senderType)) // ✅ 역할에 따라 이름 다르게
                .senderType(senderType)
                .content(content)
                .sentAt(LocalDateTime.now())
                .build();

        chatMessageRepository.save(toSave);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, toSave);
    }

    private String resolveSenderName(CustomUserDetails user, SenderType senderType) {
        // senderType에 따라 다르게 반환
        if (senderType == SenderType.CAR_CENTER) {
            CarCenterResDTO center = carCenterService.findCarCenterById(user.getUserId());
            return center.getCenterName() != null ? center.getCenterName() : "카센터";
        } else {
            // 일반 사용자라면 그냥 이름
            UserResDTO userRes = userService.getUser(user.getUserId());
            return userRes.getName() != null ? userRes.getName() : "사용자";
        }

    }




}