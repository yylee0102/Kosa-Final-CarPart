package com.spring.carparter.entity;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// CompletedRepair.java
@Entity
@Table(name = "completed_repairs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class CompletedRepair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repair_id")
    private Integer repairId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    @Column
    private String repairDetail;

    @CreatedDate
    @Column(name = "completion_date", updatable = false)
    private LocalDateTime completionDate;
}
