package com.spring.carparter.controller;

import com.spring.carparter.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 현재 로그인한 사용자가 실시간 알림을 구독하는 API
     * (로그인 필요)
     * @param userDetails 로그인한 사용자 정보 (토큰에서 추출)
     * @return SseEmitter 객체 (이 연결을 통해 서버가 클라이언트로 데이터를 보냄)
     */
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return notificationService.subscribe(userId);
    }
}