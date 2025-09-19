package com.spring.carparter.entity;

public enum EstimateStatus {
    PENDING,  // 대기중 (정비소가 막 제출한 상태)
    ACCEPTED, // 사용자가 수락한 상태
    REJECTED, // 사용자가 거절한 상태
    CANCELED  // 정비소가 취소한 상태
}