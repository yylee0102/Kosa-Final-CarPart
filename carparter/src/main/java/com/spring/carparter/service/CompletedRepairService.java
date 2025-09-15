package com.spring.carparter.service;

import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

public class CompletedRepairService {
    void makeCompletedRepair(Estimate estimate) {

    }
}
/*
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "repair_id")
    private Integer repairId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private CarCenter carCenter;

    // ✅ 추가: 어떤 견적요청에 대한 수리완료인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private QuoteRequest quoteRequest;

    @Column(name = "final_cost")
    private Integer finalCost;


        @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "estimate_id")
    private Integer estimateId;

    /**
     * 이 견적서가 속한 견적 요청 (QuoteRequest)
     */

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "request_id", nullable = false)
private QuoteRequest quoteRequest;

/**
 * 견적서를 제출한 정비소 (CarCenter)
 */
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "center_id", nullable = false)
private CarCenter carCenter;

/**
 * 예상 수리 비용
 */
@Column(name = "estimated_cost")
private Integer estimatedCost;

/**
 * 견적 상세 내용
 */
@Column(columnDefinition = "TEXT")
private String details;

/**
 * 생성 시간 (최초 저장 시 자동 생성)
 */
@CreatedDate
@Column(name = "created_at", updatable = false)
private LocalDateTime createdAt;


