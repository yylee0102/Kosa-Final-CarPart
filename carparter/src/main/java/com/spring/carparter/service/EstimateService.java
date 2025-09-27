package com.spring.carparter.service;

import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.dto.EstimateResDTO;
import com.spring.carparter.entity.*;
import com.spring.carparter.exception.ResourceNotFoundException;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.EstimateRepository;
import com.spring.carparter.repository.QuoteRequestRepository;
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
    private final NotificationService notificationService; // ✅ 1. final 키워드 추가

    // 1. 견적서 제출
    @Transactional
    public EstimateResDTO submitEstimate(String centerId, EstimateReqDTO requestDto) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new ResourceNotFoundException("카센터 정보를 찾을 수 없습니다."));

        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestDto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("견적 요청 정보를 찾을 수 없습니다."));

        Estimate estimate = requestDto.toEntity();
        estimate.setCarCenter(carCenter);
        estimate.setQuoteRequest(quoteRequest);

        Estimate savedEstimate = estimateRepository.save(estimate);

        // ✅ 2. 견적 요청을 올린 사용자에게 알림 전송
        User userToNotify = quoteRequest.getUser();
        if (userToNotify != null) {
            String message = "'" + carCenter.getCenterName() + "'에서 새로운 견적을 보냈습니다.";
            notificationService.sendNotificationToUser(userToNotify.getUserId(), message);
        }

        return EstimateResDTO.from(savedEstimate);
    }

    @Transactional(readOnly = true)
    public List<EstimateResDTO> getMyEstimates(String centerId) {
        // ✅ 1. 수정된 리포지토리 메소드를 호출합니다.
        List<Estimate> estimates = estimateRepository.findByCarCenter_CenterIdWithDetails(centerId);

        // ✅ 2. 수정된 DTO의 from 메소드를 사용하여 변환합니다.
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
                .orElseThrow(() -> new IllegalArgumentException("삭제할 견적서를 찾을 수 없습니다."));

        if (!estimate.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("견적서를 삭제할 권한이 없습니다.");
        }
        // 이미 수락된 견적인지 확인
        if (estimate.getStatus() == EstimateStatus.ACCEPTED) {
            throw new IllegalStateException("이미 수락된 견적은 취소할 수 없습니다.");
        }

        // ✅ 2. 견적서가 삭제되기 전에 사용자에게 알림 전송
        User userToNotify = estimate.getQuoteRequest().getUser();
        if (userToNotify != null) {
            String message = "'" + estimate.getCarCenter().getCenterName() + "'에서 견적을 취소했습니다.";
            notificationService.sendNotificationToUser(userToNotify.getUserId(), message);
        }

        estimateRepository.delete(estimate);
    }

    // 5. 견적서 수정
    @Transactional
    public EstimateResDTO updateEstimate(Integer estimateId, String centerId, EstimateReqDTO requestDto) {
        Estimate estimate = estimateRepository.findByIdWithItems(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 견적서를 찾을 수 없습니다."));

        if (!estimate.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("견적서를 수정할 권한이 없습니다.");
        }

        estimate.setEstimatedCost(requestDto.getEstimatedCost());
        estimate.setDetails(requestDto.getDetails());
        estimate.getEstimateItems().clear();

        if (requestDto.getEstimateItems() != null) {
            requestDto.getEstimateItems().forEach(itemDto -> {
                estimate.addEstimateItem(itemDto.toEntity());
            });
        }

        // ✅ 2. 견적서 수정 후 사용자에게 알림 전송
        User userToNotify = estimate.getQuoteRequest().getUser();
        if (userToNotify != null) {
            String message = "'" + estimate.getCarCenter().getCenterName() + "'에서 견적을 수정했습니다.";
            notificationService.sendNotificationToUser(userToNotify.getUserId(), message);
        }

        return EstimateResDTO.from(estimate);
    }

    // 6. 사용자가 견적서 거절
    @Transactional
    public void rejectEstimateByUser(String userId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("견적서를 찾을 수 없습니다."));

        String ownerId = estimate.getQuoteRequest().getUser().getUserId();
        if (!ownerId.equals(userId)) {
            throw new SecurityException("견적서를 처리할 권한이 없습니다.");
        }

        estimate.setStatus(EstimateStatus.REJECTED);

        String carCenterId = estimate.getCarCenter().getCenterId();
        String message = "회원님이 보내신 견적이 거절되었습니다. (견적 ID: " + estimateId + ")";
        notificationService.sendNotificationToUser(carCenterId, message);
    }

    /**
     * 사용자가 받은 견적서를 거절합니다.
     *
     * @param userId     요청한 사용자의 ID
     * @param estimateId 거절할 견적서의 ID
     * @throws ResourceNotFoundException 견적서를 찾을 수 없을 때
     * @throws SecurityException         견적서를 거절할 권한이 없을 때
     * @throws IllegalStateException     대기중인 견적이 아닐 때
     */
    @Transactional
    public void rejectEstimate(String userId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("거절할 견적서를 찾을 수 없습니다."));

        // 견적 요청을 올린 본인인지 권한 확인
        if (!estimate.getQuoteRequest().getUser().getUserId().equals(userId)) {
            throw new SecurityException("견적서를 거절할 권한이 없습니다.");
        }

        // 대기중인 견적인지 확인
        if (estimate.getStatus() != EstimateStatus.PENDING) {
            throw new IllegalStateException("대기중인 견적만 거절할 수 있습니다.");
        }

        estimate.setStatus(EstimateStatus.REJECTED);

        // 해당 견적서를 보낸 카센터에 알림 전송
        String carCenterId = estimate.getCarCenter().getCenterId();
        String message = "회원님이 보내신 견적이 거절되었습니다. (견적 ID: " + estimateId + ")";
        notificationService.sendNotificationToUser(carCenterId, message);
    }

    /**
     * 사용자가 받은 견적서를 수락합니다.
     *
     * @param userId     요청한 사용자의 ID
     * @param estimateId 수락할 견적서의 ID
     * @throws ResourceNotFoundException 견적서를 찾을 수 없을 때
     * @throws SecurityException         견적서를 수락할 권한이 없을 때
     * @throws IllegalStateException     대기중인 견적이 아닐 때
     */
    @Transactional
    public void acceptEstimate(String userId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("수락할 견적서를 찾을 수 없습니다."));

        // 견적 요청을 올린 본인인지 권한 확인
        if (!estimate.getQuoteRequest().getUser().getUserId().equals(userId)) {
            throw new SecurityException("견적서를 수락할 권한이 없습니다.");
        }

        // 대기중인 견적인지 확인
        if (estimate.getStatus() != EstimateStatus.PENDING) {
            throw new IllegalStateException("대기중인 견적만 수락할 수 있습니다.");
        }

        estimate.setStatus(EstimateStatus.ACCEPTED);

        // 해당 견적서를 보낸 카센터에 알림 전송
        String carCenterId = estimate.getCarCenter().getCenterId();
        String message = "회원님이 보내신 견적이 수락되었습니다. (견적 ID: " + estimateId + ")";
        notificationService.sendNotificationToUser(carCenterId, message); // 카센터 ID도 사용자 ID처럼 취급하여 전송
    }
}