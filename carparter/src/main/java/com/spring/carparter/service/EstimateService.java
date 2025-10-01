package com.spring.carparter.service;

import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.dto.EstimateResDTO;
import com.spring.carparter.entity.*;
import com.spring.carparter.exception.ResourceNotFoundException;
import com.spring.carparter.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
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
            String url = "/estimates/" + savedEstimate.getEstimateId();
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
            String url = "/user/quote-requests/" + estimate.getQuoteRequest().getRequestId();
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

        estimate.update(requestDto);

        User userToNotify = estimate.getQuoteRequest().getUser();
        if (userToNotify != null) {
            String message = "'" + estimate.getCarCenter().getCenterName() + "'에서 견적을 수정했습니다.";
            String url = "/estimates/" + estimateId;
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

        CarCenter carCenterToNotify = estimate.getCarCenter();
        String message = "회원님이 보내신 견적이 거절되었습니다. (견적 ID: " + estimateId + ")";
        String url = "/center/estimates#sent";
        notificationService.sendNotificationToCarCenter(carCenterToNotify, message, url);
    }

    // 7. 사용자가 견적서 수락
    @Transactional
    public void acceptEstimate(String userId, Integer estimateId) {
        log.info("===== [START] 견적서 수락: 사용자 ID '{}', 견적서 ID '{}' =====", userId, estimateId);
        Estimate acceptedEstimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("수락할 견적서를 찾을 수 없습니다."));
        log.info(" -> 견적서 ID '{}' 조회 완료.", estimateId);

        if (!acceptedEstimate.getQuoteRequest().getUser().getUserId().equals(userId)) {
            log.error("   ❌ 권한 없음: 사용자 '{}'가 다른 사람의 견적서 수락 시도.", userId);
            throw new SecurityException("견적서를 수락할 권한이 없습니다.");
        }
        if (acceptedEstimate.getStatus() != EstimateStatus.PENDING) {
            log.warn("   -> 이미 처리된 견적(상태: {})은 수락할 수 없습니다.", acceptedEstimate.getStatus());
            throw new IllegalStateException("대기중인 견적만 수락할 수 있습니다.");
        }

        log.info(" -> 견적서 상태를 ACCEPTED로 변경합니다...");
        acceptedEstimate.setStatus(EstimateStatus.ACCEPTED);

        log.info(" -> 나머지 '대기중' 상태의 견적서들을 '거절됨'으로 변경합니다...");
        QuoteRequest quoteRequest = acceptedEstimate.getQuoteRequest();
        List<Estimate> otherEstimates = estimateRepository.findByQuoteRequestAndStatus(quoteRequest, EstimateStatus.PENDING);

        for (Estimate other : otherEstimates) {
            if (!other.getEstimateId().equals(acceptedEstimate.getEstimateId())) {
                other.setStatus(EstimateStatus.REJECTED);
                log.info("   -> 견적서 ID '{}' 상태를 REJECTED로 변경.", other.getEstimateId());
            }
        }

        log.info(" -> '수리 내역(CompletedRepair)' 생성을 시작합니다...");
        CompletedRepair newRepair = CompletedRepair.builder()
                .userId(acceptedEstimate.getQuoteRequest().getUser().getUserId())
                .userName(acceptedEstimate.getQuoteRequest().getUser().getName())
                .carCenterId(acceptedEstimate.getCarCenter().getCenterId())
                .carCenterName(acceptedEstimate.getCarCenter().getCenterName())
                .originalRequestId(acceptedEstimate.getQuoteRequest().getRequestId())
                .originalEstimateId(acceptedEstimate.getEstimateId())
                .finalCost(acceptedEstimate.getEstimatedCost())
                .carModel(acceptedEstimate.getQuoteRequest().getUserCar().getCarModel())
                .licensePlate(acceptedEstimate.getQuoteRequest().getUserCar().getCarNumber())
                .repairDetails(acceptedEstimate.getQuoteRequest().getRequestDetails())
                .status(RepairStatus.IN_PROGRESS)
                .build();

        completedRepairRepository.save(newRepair);
        log.info("   -> '수리 내역' 생성 및 저장 완료.");

        log.info(" -> 카센터에게 수락 알림을 전송합니다...");
        // ✅ [최종 수정] 사용자의 지적대로 수리 관리 탭으로 바로 가도록 URL 수정
        notificationService.sendNotificationToCarCenter(acceptedEstimate.getCarCenter(), "회원님이 보내신 견적이 수락되었습니다. 수리를 진행해주세요.", "/center/estimates#repairs");

        log.info("===== [END] 견적서 수락 완료 =====");
    }

    /**
     * ✅ [신규 추가] 특정 견적 요청에 대한 모든 견적서 목록 조회 (사용자용)
     */
    @Transactional(readOnly = true)
    public List<EstimateResDTO> getEstimatesForRequest(Integer requestId, String userId) {
        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("견적 요청을 찾을 수 없습니다."));

        if (!quoteRequest.getUser().getUserId().equals(userId)) {
            throw new SecurityException("자신의 견적 요청에 대한 견적서만 조회할 수 있습니다.");
        }

        List<Estimate> estimates = estimateRepository.findByQuoteRequest_RequestIdWithItems(requestId);

        return estimates.stream()
                .map(EstimateResDTO::from)
                .collect(Collectors.toList());
    }
}