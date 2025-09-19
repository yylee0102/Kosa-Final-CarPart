package com.spring.carparter.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class NotificationService {

    // 스레드 안전한 ConcurrentHashMap을 사용하여 사용자별 Emitter를 저장합니다.
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    /**
     * 클라이언트가 알림을 구독하기 위해 연결합니다.
     * @param userId 구독하는 사용자의 ID (User, CarCenter, Admin의 PK)
     * @return 생성된 SseEmitter 객체
     */
    public SseEmitter subscribe(String userId) {
        // 1시간 타임아웃 설정
        SseEmitter emitter = new SseEmitter(3600L * 1000);
        emitters.put(userId, emitter);

        // 연결이 종료되거나 타임아웃 발생 시 emitters 맵에서 제거
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError(e -> {
            log.warn("SSE 오류 발생. 사용자 ID: {}, 오류: {}", userId, e.toString());
            emitters.remove(userId);
        });

        // 연결이 생성되었다는 더미(dummy) 데이터를 보내야 연결이 끊어지지 않습니다.
        try {
            emitter.send(SseEmitter.event().name("connect").data("SSE connection established for user: " + userId));
        } catch (IOException e) {
            log.error("SSE 초기 연결 메시지 전송 중 오류", e);
            emitters.remove(userId);
        }

        log.info("SSE 연결 생성됨. 사용자 ID: {}", userId);
        return emitter;
    }

    /**
     * 특정 사용자에게 알림을 전송합니다.
     * @param userId 알림을 받을 사용자의 ID
     * @param message 전송할 메시지 내용
     */
    public void sendNotificationToUser(String userId, String message) {
        SseEmitter emitter = emitters.get(userId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification") // 프론트엔드에서 이 이름으로 이벤트를 수신
                        .data(message));
                log.info("알림 전송 성공. 사용자 ID: {}, 메시지: {}", userId, message);
            } catch (IOException e) {
                log.error("알림 전송 중 오류. 사용자 ID: {}, 오류: {}", userId, e.getMessage());
                // 전송 실패 시 연결이 끊어진 것으로 간주하고 제거
                emitters.remove(userId);
            }
        } else {
            log.warn("알림 전송 실패: 현재 연결되어 있지 않은 사용자 ID {}", userId);
        }
    }
}