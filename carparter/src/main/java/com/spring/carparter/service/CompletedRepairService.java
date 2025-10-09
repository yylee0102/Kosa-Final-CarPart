package com.spring.carparter.service;

import com.spring.carparter.dto.CompletedRepairResDTO;
import com.spring.carparter.entity.*;
import com.spring.carparter.exception.ResourceNotFoundException;
import com.spring.carparter.repository.CompletedRepairRepository;
import com.spring.carparter.repository.EstimateRepository;
import com.spring.carparter.repository.QuoteRequestRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CompletedRepairService {

    private final CompletedRepairRepository completedRepairRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final EstimateRepository estimateRepository;
    /**
     * 특정 사용자의 모든 수리 완료 내역을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<CompletedRepairResDTO> getCompletedRepairListByUserId(String userId) {
        log.info("사용자 수리 내역 조회: {}", userId);
        // ▼▼▼ [수정] 레포지토리의 실제 메소드 이름으로 변경 ▼▼▼
        List<CompletedRepair> repairs = completedRepairRepository.findByUserIdOrderByCompletedAtDesc(userId);
        return repairs.stream()
                .map(CompletedRepairResDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 특정 카센터의 모든 수리 완료 내역을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<CompletedRepairResDTO> getCompletedRepairListByCenterId(String centerId) {
        log.info("카센터 수리 내역 조회: {}", centerId);
        // ▼▼▼ [수정] 레포지토리의 실제 메소드 이름으로 변경 ▼▼▼
        List<CompletedRepair> repairs = completedRepairRepository.findByCarCenterIdOrderByCompletedAtDesc(centerId);
        return repairs.stream()
                .map(CompletedRepairResDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 수리를 완료 상태로 변경하고, 사용자에게 리뷰 요청 알림을 보냅니다.
     */

    @Transactional
    public void markAsCompleted(Long repairId, String centerId) {
        log.info("===== [START] 수리 완료 처리 및 리뷰 요청: 수리 ID '{}' =====", repairId);

        CompletedRepair repair = completedRepairRepository.findById(repairId)
                .orElseThrow(() -> new RuntimeException("수리 내역을 찾을 수 없습니다."));

        if (!repair.getCarCenterId().equals(centerId)) {
            throw new SecurityException("수리 내역을 완료할 권한이 없습니다.");
        }

        // 1) 상태 변경
        repair.setStatus(RepairStatus.COMPLETED);
        repair.setCompletedAt(LocalDateTime.now());
        log.info(" -> 수리 ID '{}' 상태를 COMPLETED로 변경 완료.", repairId);

        // 2) 관련 견적/견적요청 삭제
        //    JPQL 버전 사용 시:
        //Integer requestId = completedRepairRepository.findRequestIdByRepairIdNative(repairId) // CHANGE: 연관이 있으면 이 라인
            //    .orElse(null);


        Integer requestId = completedRepairRepository.findRequestIdByRepairIdNative(repairId).orElse(null);

        if (requestId != null) {
            log.info(" -> 관련 견적 및 견적 요청 삭제 시작 (requestId={})", requestId);

            // 2-1) Estimate 먼저 삭제 (FK/카스케이드가 없다면 순서 중요)
            List<Estimate> estimates = estimateRepository.findByQuoteRequest_RequestIdWithItems(requestId); // CHANGE: 네 리포지토리 메서드 사용
            if (!estimates.isEmpty()) {
                estimateRepository.deleteAll(estimates);
                log.info("   - {}건의 Estimate 삭제 완료", estimates.size());
            }

            // 2-2) QuoteRequest 삭제
            quoteRequestRepository.deleteById(requestId);
            log.info("   - QuoteRequest(ID={}) 삭제 완료", requestId);
        } else {
            log.warn(" -> requestId를 찾지 못했습니다. (repairId={}) - 스키마/연관 확인 필요", repairId);
        }

        // 3) 사용자에게 리뷰 요청 알림 발송 (기존 그대로)
        log.info(" -> 사용자 '{}'에게 리뷰 요청 알림 전송을 시작합니다.", repair.getUserId());
        userRepository.findById(repair.getUserId()).ifPresent(userToNotify -> {
            String message = "'" + repair.getCarCenterName() + "'에서의 수리가 완료되었습니다. 소중한 리뷰를 남겨주세요!";
            String url = "/mypage/reviews/new?repairId=" + repair.getRepairId();
            notificationService.sendNotificationToUser(userToNotify, message, url);
        });

        log.info("===== [END] 수리 완료 처리 + 관련 데이터 삭제 + 리뷰 요청 알림 완료 =====");
    }


    @Transactional(readOnly = true)
    public CompletedRepairResDTO getCompletedRepairDetails(Long repairId, String requesterId) {
        CompletedRepair repair = completedRepairRepository.findById(repairId)
                .orElseThrow(() -> new ResourceNotFoundException("수리 내역을 찾을 수 없습니다."));

        // 본인 또는 담당 카센터만 조회 가능
        if (!repair.getUserId().equals(requesterId) && !repair.getCarCenterId().equals(requesterId)) {
            throw new SecurityException("조회 권한이 없습니다.");
        }

        return CompletedRepairResDTO.from(repair);
    }
    // 견적 요청서 삭제를 위해 추가

    /**
     * ✅ [신규 추가] 카센터가 수리를 완료 처리하는 메서드
     * @param carCenterId 현재 로그인한 카센터 ID
     * @param estimateId 완료 처리할, '수락된' 상태의 견적서 ID
     */
    @Transactional
    public void makeCompleteRepair(String carCenterId, Integer estimateId) {
        // 1. '수락된' 상태의 견적서를 조회합니다.
        Estimate acceptedEstimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new ResourceNotFoundException("견적서를 찾을 수 없습니다."));

        // 2. 권한 및 상태 검증
        if (!acceptedEstimate.getCarCenter().getCenterId().equals(carCenterId)) {
            throw new SecurityException("수리를 완료할 권한이 없습니다.");
        }
        if (acceptedEstimate.getStatus() != EstimateStatus.ACCEPTED) {
            throw new IllegalStateException("수락된 상태의 견적만 완료 처리할 수 있습니다.");
        }

        // 3. '수리 내역(CompletedRepair)'을 생성합니다. (acceptEstimate에서 가져온 로직)
        CompletedRepair newRepair = CompletedRepair.builder()
                .userId(acceptedEstimate.getQuoteRequest().getUser().getUserId())
                .userName(acceptedEstimate.getQuoteRequest().getUser().getName())
                .carCenterId(acceptedEstimate.getCarCenter().getCenterId())
                .carCenterName(acceptedEstimate.getCarCenter().getCenterName())
                .originalRequestId(acceptedEstimate.getQuoteRequest().getRequestId())
                .originalEstimateId(acceptedEstimate.getEstimateId())
                .finalCost(acceptedEstimate.getEstimatedCost())
                .repairDetails(acceptedEstimate.getQuoteRequest().getRequestDetails())
                .completedAt(LocalDateTime.now()) // 완료 시점의 시간 기록
                .status(RepairStatus.COMPLETED)   // 최종 상태는 'COMPLETED'
                .build();

        completedRepairRepository.save(newRepair);

        // 4. 완료 처리 후, 기존의 견적 요청서와 관련 데이터들을 삭제합니다.
        QuoteRequest quoteRequestToDelete = acceptedEstimate.getQuoteRequest();
        quoteRequestRepository.delete(quoteRequestToDelete); // 연관된 Estimate들도 함께 삭제됩니다 (Cascade 설정에 따라)
    }
}