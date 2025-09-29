package com.spring.carparter.service;

import com.spring.carparter.dto.NotificationResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Notification;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final NotificationRepository notificationRepository;
    private final CarCenterRepository carCenterRepository;

    public SseEmitter subscribe(String userId) {
        log.info("===== [START] SSE 구독 시작: 사용자 ID '{}' =====", userId);
        SseEmitter emitter = new SseEmitter(3600L * 1000);
        emitters.put(userId, emitter);
        log.info(" -> Emitter 객체 생성 및 저장 완료. 현재 연결된 Emitter 수: {}", emitters.size());

        emitter.onCompletion(() -> {
            log.info(" -> SSE 연결 완료됨 (onCompletion). 사용자 ID: '{}'", userId);
            emitters.remove(userId);
        });
        emitter.onTimeout(() -> {
            log.info(" -> SSE 연결 시간 초과 (onTimeout). 사용자 ID: '{}'", userId);
            emitters.remove(userId);
        });
        emitter.onError(e -> {
            log.warn(" -> SSE 오류 발생 (onError). 사용자 ID: '{}', 오류: {}", userId, e.toString());
            emitters.remove(userId);
        });

        try {
            emitter.send(SseEmitter.event().name("connect").data("SSE connection established for user: " + userId));
            log.info(" -> 초기 연결 확인 메시지 전송 성공.");
        } catch (IOException e) {
            log.error(" -> 초기 연결 메시지 전송 중 오류 발생.", e);
            emitters.remove(userId);
        }
        log.info("===== [END] SSE 구독 완료: 사용자 ID '{}' =====", userId);
        return emitter;
    }

    @Transactional
    private void sendNotification(String receiverId, String message, String url) {
        log.info(" -> [private] sendNotification 호출됨. 수신자: '{}'", receiverId);
        Notification notification = Notification.builder()
                .receiverId(receiverId)
                .message(message)
                .url(url)
                .build();
        notificationRepository.save(notification);
        log.info("   - 알림 DB 저장 완료. (내용: '{}')", message);

        SseEmitter emitter = emitters.get(receiverId);
        if (emitter != null) {
            log.info("   - 온라인 상태(Emitter 존재). 실시간 알림 전송 시도...");
            try {
                // 실제 전송 시 DTO 변환이 필요할 수 있습니다.
                // 예: emitter.send(SseEmitter.event().name("notification").data(NotificationResDTO.from(notification)));
                emitter.send(SseEmitter.event().name("notification").data(message));
                log.info("   - ✅ 실시간 알림 전송 성공!");
            } catch (IOException e) {
                log.error("   - ❌ 실시간 알림 전송 중 오류 발생.", e);
                emitters.remove(receiverId);
            }
        } else {
            log.warn("   - 오프라인 상태(Emitter 없음). DB에만 알림이 저장됩니다.");
        }
    }

    public void sendNotificationToAllCarCenters(String message, String url) {
        log.info("===== [START] 전체 카센터 알림 전송 =====");
        List<CarCenter> allCarCenters = carCenterRepository.findAll();
        log.info(" -> 총 {}개의 카센터를 대상으로 알림 전송을 시작합니다.", allCarCenters.size());

        for (CarCenter center : allCarCenters) {
            log.info("   -> 카센터 '{}' 알림 전송 처리...", center.getCenterId());
            sendNotification(center.getCenterId(), message, url);
        }
        log.info("===== [END] 전체 카센터 알림 전송 완료 =====");
    }

    public void sendNotificationToUser(User user, String message, String url) {
        log.info("===== [START] 특정 사용자 알림 전송: 수신자 '{}' =====", user != null ? user.getUserId() : "null");
        if (user != null) {
            sendNotification(user.getUserId(), message, url);
        } else {
            log.warn(" -> 알림을 보낼 User 객체가 null이므로 로직을 중단합니다.");
        }
        log.info("===== [END] 특정 사용자 알림 전송 완료 =====");
    }

    public void sendNotificationToCarCenter(CarCenter center, String message, String url) {
        log.info("===== [START] 특정 카센터 알림 전송: 수신자 '{}' =====", center != null ? center.getCenterId() : "null");
        if (center != null) {
            sendNotification(center.getCenterId(), message, url);
        } else {
            log.warn(" -> 알림을 보낼 CarCenter 객체가 null이므로 로직을 중단합니다.");
        }
        log.info("===== [END] 특정 카센터 알림 전송 완료 =====");
    }

    @Transactional(readOnly = true)
    public List<NotificationResDTO> getUserNotifications(String userId) {
        log.info("===== [START] 사용자 알림 목록 조회: 사용자 ID '{}' =====", userId);
        List<Notification> notifications = notificationRepository.findAllByReceiverIdOrderByCreateTimeDesc(userId);
        log.info(" -> 조회된 알림 개수: {}", notifications.size());
        log.info("===== [END] 사용자 알림 목록 조회 완료 =====");
        // NotificationResDTO.from(Notification) 메소드가 필요합니다.
        return notifications.stream()
                .map(NotificationResDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(String userId) {
        log.info("===== [START] 안 읽은 알림 개수 조회: 사용자 ID '{}' =====", userId);
        long count = notificationRepository.countByReceiverIdAndIsReadFalse(userId);
        log.info(" -> 조회된 안 읽은 알림 개수: {}", count);
        log.info("===== [END] 안 읽은 알림 개수 조회 완료 =====");
        return count;
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        log.info("===== [START] 알림 읽음 처리: 알림 ID '{}' =====", notificationId);
        notificationRepository.findById(notificationId)
                .ifPresentOrElse(
                        notification -> {
                            notification.markAsRead();
                            log.info(" -> 알림 ID '{}'를 읽음 상태로 변경했습니다.", notificationId);
                        },
                        () -> log.warn(" -> 읽음 처리할 알림을 찾지 못했습니다. 알림 ID: '{}'", notificationId)
                );
        log.info("===== [END] 알림 읽음 처리 완료 =====");
    }
}