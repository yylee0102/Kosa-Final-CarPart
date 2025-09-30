package com.spring.carparter.dto;

import com.spring.carparter.entity.Notification;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResDTO {
    private Long id;
    private String message;
    private boolean isRead;
    private String url;
    private LocalDateTime CreateTime;

    public static NotificationResDTO from(Notification notification) {
        return NotificationResDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .url(notification.getUrl())
                .CreateTime(notification.getCreateTime())
                .build();
    }
}