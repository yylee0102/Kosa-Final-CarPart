package com.spring.carparter.controller;

import com.spring.carparter.dto.NotificationResDTO;
import com.spring.carparter.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * ✅ [기존 기능]
     * 현재 로그인한 사용자가 실시간 알림을 구독합니다.
     * @param userDetails 로그인한 사용자 정보
     * @return SseEmitter 객체
     */
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return notificationService.subscribe(userId);
    }

    /**
     * ✅ [신규 추가]
     * 현재 로그인한 사용자의 모든 알림 목록을 조회합니다. (최신순)
     * @param userDetails 로그인한 사용자 정보
     * @return 알림 목록
     */
    @GetMapping
    public ResponseEntity<List<NotificationResDTO>> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<NotificationResDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * ✅ [신규 추가]
     * 현재 로그인한 사용자의 안 읽은 알림 개수를 조회합니다. (알림 아이콘 뱃지용)
     * @param userDetails 로그인한 사용자 정보
     * @return 안 읽은 알림 개수
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCount(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        long count = notificationService.getUnreadNotificationCount(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * ✅ [신규 추가]
     * 특정 알림을 '읽음' 상태로 변경합니다.
     * @param notificationId 읽음 처리할 알림의 ID
     * @return 성공 응답
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable("id") Long notificationId) {
        // 참고: 본인 알림이 맞는지 권한 검증 로직을 서비스 레이어에 추가할 수 있습니다.
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}