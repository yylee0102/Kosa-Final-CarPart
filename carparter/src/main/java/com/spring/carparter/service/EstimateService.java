package com.spring.carparter.service;

import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.dto.EstimateResDTO;
import com.spring.carparter.entity.*;
import com.spring.carparter.exception.ResourceNotFoundException;
import com.spring.carparter.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final CarCenterRepository carCenterRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private  final CompletedRepairRepository completedRepairRepository;
    // 1. 견적서 제출
    @Transactional
    public EstimateResDTO submitEstimate(String centerId, EstimateReqDTO requestDto) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new ResourceNotFoundException("카센터 정보를 찾을 수 없습니다."));

        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestDto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("견적 요청 정보를 찾을 수 없습니다."));

        if (quoteRequest.getUser().getUserId().equals(centerId)) {
            throw new IllegalArgumentException("자신이 올린 견적 요청에는 견적을 제출할 수 없습니다.");
        }

        Estimate estimate = requestDto.toEntity();
        estimate.setCarCenter(carCenter);
        estimate.setQuoteRequest(quoteRequest);

        Estimate savedEstimate = estimateRepository.save(estimate);

        User userToNotify = quoteRequest.getUser();
        if (userToNotify != null) {
            String message = "'" + carCenter.getCenterName() + "'에서 새로운 견적을 보냈습니다.";
            String url = "/mypage/estimates/" + savedEstimate.getEstimateId(); // 고객이 이동할 경로
            notificationService.sendNotificationToUser(userToNotify, message, url);
        }

        return EstimateResDTO.from(savedEstimate);
    }

    // 2. 내 견적서 목록 조회
    @Transactional(readOnly = true)
    public List<EstimateResDTO> getMyEstimates(String centerId) {
        List<Estimate> estimates = estimateRepository.findByCarCenter_CenterIdWithDetails(centerId);
        return estimates.stream()
                .map(EstimateResDTO::from)
                .collect(Collectors.toList());
    }

    // 3. 특정 견적서 상세 조회
    @Transactional(readOnly = true)
    public EstimateResDTO getEstimateDetails(Integer estimateId) {
        Estimate estimate = estimateRepository.findByIdWithItems(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("견적서를 찾을 수 없습니다."));
        return EstimateResDTO.from(estimate);
    }

    // 4. 견적서 삭제 (카센터가 취소)
    @Transactional
    public void deleteEstimate(String centerId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("삭제할 견적서를 찾을 수 없습니다."));

        if (!estimate.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("견적서를 삭제할 권한이 없습니다.");
        }
        if (estimate.getStatus() == EstimateStatus.ACCEPTED) {
            throw new IllegalStateException("이미 수락된 견적은 취소할 수 없습니다.");
        }

        User userToNotify = estimate.getQuoteRequest().getUser();
        if (userToNotify != null) {
            String message = "'" + estimate.getCarCenter().getCenterName() + "'에서 견적을 취소했습니다.";
            // ✅ [수정] url 인수 추가
            String url = "/mypage/estimates/" + estimateId;
            notificationService.sendNotificationToUser(userToNotify, message, url);
        }

        estimateRepository.delete(estimate);
    }

    // 5. 견적서 수정
    @Transactional
    public EstimateResDTO updateEstimate(Integer estimateId, String centerId, EstimateReqDTO requestDto) {
        Estimate estimate = estimateRepository.findByIdWithItems(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("수정할 견적서를 찾을 수 없습니다."));

        if (!estimate.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("견적서를 수정할 권한이 없습니다.");
        }

        // JPA의 변경 감지(Dirty Checking)를 활용하여 update
        estimate.update(requestDto); // 엔티티에 update 메서드가 있다고 가정

        User userToNotify = estimate.getQuoteRequest().getUser();
        if (userToNotify != null) {
            String message = "'" + estimate.getCarCenter().getCenterName() + "'에서 견적을 수정했습니다.";
            // ✅ [수정] url 인수 추가
            String url = "/mypage/estimates/" + estimateId;
            notificationService.sendNotificationToUser(userToNotify, message, url);
        }

        return EstimateResDTO.from(estimate);
    }

    // 6. 사용자가 견적서 거절
    @Transactional
    public void rejectEstimate(String userId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("거절할 견적서를 찾을 수 없습니다."));

        if (!estimate.getQuoteRequest().getUser().getUserId().equals(userId)) {
            throw new SecurityException("견적서를 거절할 권한이 없습니다.");
        }
        if (estimate.getStatus() != EstimateStatus.PENDING) {
            throw new IllegalStateException("대기중인 견적만 거절할 수 있습니다.");
        }

        estimate.setStatus(EstimateStatus.REJECTED);

        // ▼▼▼▼▼ [수정된 알림 전송 로직] ▼▼▼▼▼
        String carCenterId = estimate.getCarCenter().getCenterId();
        String message = "회원님이 보내신 견적이 거절되었습니다. (견적 ID: " + estimateId + ")";
        String url = "/center/estimates#sent";

        // 1. 카센터 ID로 User 객체를 찾습니다.
        userRepository.findById(carCenterId).ifPresent(carCenterUser -> {
            // 2. 찾은 User 객체를 사용하여 알림을 보냅니다.
            notificationService.sendNotificationToUser(carCenterUser, message, url);
        });
        // ▲▲▲▲▲ [수정된 알림 전송 로직] ▲▲▲▲▲
    }

    // 7. 사용자가 견적서 수락
    @Transactional
    public void acceptEstimate(String userId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("수락할 견적서를 찾을 수 없습니다."));

        // ... (기존 권한 및 상태 검증 로직은 동일) ...
        if (!estimate.getQuoteRequest().getUser().getUserId().equals(userId)) {
            throw new SecurityException("견적서를 수락할 권한이 없습니다.");
        }
        if (estimate.getStatus() != EstimateStatus.PENDING) {
            throw new IllegalStateException("대기중인 견적만 수락할 수 있습니다.");
        }

        estimate.setStatus(EstimateStatus.ACCEPTED);

        // ▼▼▼▼▼ 3. [신규 추가] 수리 내역 생성 로직 ▼▼▼▼▼
        CompletedRepair newRepair = CompletedRepair.builder()
                .user(estimate.getQuoteRequest().getUser())
                .carCenter(estimate.getCarCenter())
                .repairDetail(estimate.getQuoteRequest().getRequestDetails()) // 초기 수리 내용은 견적 요청 내용으로 설정
                // completionDate는 Auditing 기능으로 자동 생성됩니다.
                .build();

        completedRepairRepository.save(newRepair);
        // ▲▲▲▲▲ [신규 추가] 여기까지 ▲▲▲▲▲

        // ... (기존 카센터 알림 전송 로직은 동일) ...
        String carCenterId = estimate.getCarCenter().getCenterId();
        String message = "회원님이 보내신 견적이 수락되었습니다. (견적 ID: " + estimateId + ")";
        String url = "/center/estimates#sent";
        userRepository.findById(carCenterId).ifPresent(carCenterUser -> {
            notificationService.sendNotificationToUser(carCenterUser, message, url);
        });
    }
}