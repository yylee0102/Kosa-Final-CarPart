// 파일 경로: com/spring/carparter/Controller/ChatRoomController.java

package com.spring.carparter.controller;

import com.spring.carparter.dto.ChatRoomReqDTO;
import com.spring.carparter.dto.ChatRoomResDTO;
import com.spring.carparter.dto.EstimateResDTO;
import com.spring.carparter.entity.ChatRoom;
import com.spring.carparter.entity.Estimate;
import com.spring.carparter.service.ChatRoomService;
import com.spring.carparter.service.EstimateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final EstimateService estimateService;

    // ▼▼▼ 이 메소드를 새로 추가하세요 ▼▼▼
    /**
     * 특정 카센터와의 채팅방을 찾거나 새로 생성하는 API
     * @param userDetails 현재 로그인한 사용자 정보
     * @param reqDTO 채팅을 시작할 상대방(카센터)의 ID가 담긴 DTO
     * @return 생성되거나 기존에 있던 채팅방 정보
     */
    @PostMapping("/api/chat/rooms")
    public ResponseEntity<ChatRoomResDTO> findOrCreateRoom(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChatRoomReqDTO reqDTO) {

        String userId = userDetails.getUsername();
        // ✅ DTO에서 ID를 가져오는 메소드를 'getCenterId()'로 변경합니다.
        EstimateResDTO estimate = estimateService.getEstimateDetails(reqDTO.getEstimateId().intValue());
        String centerId = estimate.getCenterId();

        ChatRoom room = chatRoomService.findOrCreateRoom(userId, centerId);

        return ResponseEntity.ok(ChatRoomResDTO.from(room));
    }


    /**
     * 현재 로그인한 사용자의 모든 채팅방 목록을 반환하는 API
     */
    @GetMapping("/api/chat/rooms")
    public ResponseEntity<List<ChatRoomResDTO>> getMyChatRooms(@AuthenticationPrincipal UserDetails userDetails) {
        String loginId = userDetails.getUsername();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        boolean isCenter = authorities.stream()
                .anyMatch(auth -> "ROLE_CAR_CENTER".equals(auth.getAuthority()));

        List<ChatRoomResDTO> rooms;
        if (isCenter) {
            // 카센터 로그인 시 -> 카센터용 목록 조회
            rooms = chatRoomService.getRoomsForCenter(loginId);
        } else {
            // 일반 사용자 로그인 시 -> 사용자용 목록 조회
            rooms = chatRoomService.getRoomsForUser(loginId);
        }
        return ResponseEntity.ok(rooms);
    }
}