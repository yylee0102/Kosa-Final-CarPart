package com.spring.carparter.repository;

import com.spring.carparter.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByReceiverIdOrderByCreateTimeDesc(String receiverId);

    long countByReceiverIdAndIsReadFalse(String receiverId);
}