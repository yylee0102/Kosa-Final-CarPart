package com.spring.carparter.service;

import com.spring.carparter.dto.QuoteRequestReqDTO;
import com.spring.carparter.dto.QuoteRequestResDTO;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.RequestImage;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import com.spring.carparter.repository.EstimateRepository;
import com.spring.carparter.repository.QuoteRequestRepository;
import com.spring.carparter.repository.UserCarRepository;
import com.spring.carparter.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class QuoteRequestService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final UserRepository userRepository;
    private final UserCarRepository userCarRepository;
    private final S3Service s3Service;
    private final EstimateRepository estimateRepository;
    private final NotificationService notificationService;

    /**
     * 사용자 견적요청 생성 (+이미지 업로드 및 알림 전송)
     */
    @Transactional
    public QuoteRequestResDTO createQuoteRequestWithImages(
            String userId,
            QuoteRequestReqDTO request,
            List<MultipartFile> images
    ) {
        log.info("===== [START] 견적 요청 생성 (이미지 포함): 사용자 ID '{}' =====", userId);
        log.info(" -> 요청 DTO: {}", request);
        log.info(" -> 이미지 파일 개수: {}", images != null ? images.size() : 0);

        log.info(" -> 1. 사용자 정보 조회...");
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            log.error("   ❌ 사용자를 찾을 수 없습니다: ID '{}'", userId);
            throw new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId);
        }
        log.info("   -> 사용자 '{}' 조회 완료.", user.getName());

        log.info(" -> 2. 사용자 차량 정보 조회...");
        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> {
                    log.error("   ❌ 사용자 차량을 찾을 수 없습니다: ID '{}'", request.getUserCarId());
                    return new EntityNotFoundException("사용자 차량을 찾을 수 없습니다: " + request.getUserCarId());
                });
        log.info("   -> 차량 '{}' 조회 완료.", userCar.getCarModel());

        log.info(" -> 3. 견적 요청 엔티티 생성...");
        QuoteRequest quoteRequest = request.toEntity(request, user, userCar);
        log.info("   -> 엔티티 변환 완료.");

        // S3 연동 시 이 부분 주석을 해제하세요.
        /*
        if (images != null && !images.isEmpty()) {
            log.info(" -> 4. 이미지 S3 업로드 처리 시작...");
            images.forEach(file -> {
                if (file != null && !file.isEmpty()) {
                    String objectKey = "requests/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
                    try {
                        log.info("   -> 파일 '{}' 업로드 중...", file.getOriginalFilename());
                        String imageUrl = s3Service.uploadFile(file, objectKey);
                        quoteRequest.addRequestImage(RequestImage.builder().imageUrl(imageUrl).build());
                        log.info("   -> 파일 '{}' 업로드 성공. URL: {}", file.getOriginalFilename(), imageUrl);
                    } catch (Exception e) {
                        log.error("   ❌ S3 파일 업로드 실패: 파일 '{}'", file.getOriginalFilename(), e);
                        throw new RuntimeException("S3 파일 업로드에 실패했습니다.", e);
                    }
                }
            });
            log.info(" -> 4. 이미지 S3 업로드 처리 완료.");
        }
        */

        log.info(" -> 5. 견적 요청 DB 저장...");
        QuoteRequest saved = quoteRequestRepository.save(quoteRequest);
        log.info("   -> DB 저장 완료. 생성된 요청 ID: {}", saved.getRequestId());

        log.info(" -> 6. 전체 카센터 알림 전송 로직 시작...");
        try {
            String message = "새로운 견적 요청: " + saved.getRequestDetails();
            String url = "/center/estimates"; // 카센터가 이동할 프론트엔드 경로
            notificationService.sendNotificationToAllCarCenters(message, url);
        } catch (Exception e) {
            log.error("   ❌ 전체 카센터 알림 전송 중 오류 발생. 요청 ID: {}", saved.getRequestId(), e);
        }
        log.info(" -> 6. 전체 카센터 알림 전송 로직 완료.");

        log.info(" -> 7. 응답 DTO 변환...");
        QuoteRequestResDTO responseDto = convertToDtoWithDetails(saved);
        log.info("   -> DTO 변환 완료.");

        log.info("===== [END] 견적 요청 생성 완료 =====");
        return responseDto;
    }

    /**
     * (호환용) 이미지 없이 생성하는 기존 진입점
     */
    @Transactional
    public QuoteRequest createAndSaveQuoteRequest(QuoteRequestReqDTO request) {
        User user = userRepository.findByUserId(request.getUserId());
        if(user == null){
            throw new EntityNotFoundException("사용자를 찾을 수 없습니다: " + request.getUserId());
        }
        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> new IllegalArgumentException("UserCar not found with id: " + request.getUserCarId()));

        QuoteRequest quoteRequest = request.toEntity(request, user, userCar);
        return quoteRequestRepository.save(quoteRequest);
    }

    /** 삭제 */
    @Transactional
    public void deleteQuoteRequest(Integer quoteRequestId) {
        quoteRequestRepository.deleteById(quoteRequestId);
    }

    /** 엔티티 단건 조회 */
    @Transactional(readOnly = true)
    public QuoteRequest getQuoteRequest(Integer quoteRequestId) {
        return quoteRequestRepository.findById(quoteRequestId)
                .orElseThrow(() -> new EntityNotFoundException("견적 요청을 찾을 수 없습니다: " + quoteRequestId));
    }

    /**
     * 모든 견적 요청 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getAllQuoteRequests() {
        return quoteRequestRepository.findAllWithDetails()
                .stream()
                .map(this::convertToDtoWithDetails)
                .collect(Collectors.toList());
    }

    /** 아이디로 상세 정보를 조회합니다. */
    @Transactional(readOnly = true)
    public QuoteRequestResDTO getQuoteRequestDetails(Integer requestId) {
        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("견적 요청을 찾을 수 없습니다: " + requestId));
        return convertToDtoWithDetails(quoteRequest);
    }

    /**
     * 카센터 관점에서 모든 견적 요청 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getQuoteRequestsForCenter(String centerId) {
        return quoteRequestRepository.findAllWithDetails().stream()
                .map(this::convertToDtoWithDetails)
                .collect(Collectors.toList());
    }

    /**
     * 카센터용: 특정 요청 상세 + "이미 내가 견적 제출했는지" 여부 반환
     */
    @Transactional(readOnly = true)
    public CenterQuoteRequestView getQuoteRequestDetailsForCenter(String centerId, Integer requestId) {
        QuoteRequest qr = quoteRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("견적 요청을 찾을 수 없습니다: " + requestId));

        QuoteRequestResDTO dto = convertToDtoWithDetails(qr);
        boolean alreadyEstimatedByMe =
                estimateRepository.existsByQuoteRequest_RequestIdAndCarCenter_CenterId(requestId, centerId);

        return new CenterQuoteRequestView(dto, alreadyEstimatedByMe);
    }

    /** 카센터 전용 응답 래퍼 (필요 시 별 파일로 분리) */
    public record CenterQuoteRequestView(
            QuoteRequestResDTO request,
            boolean alreadyEstimatedByMe
    ) {}

    /**
     * 공통: 엔티티→DTO 변환 + 부가정보(견적 개수) 처리
     */
    private QuoteRequestResDTO convertToDtoWithDetails(QuoteRequest quoteRequest) {
        long estimateCount = estimateRepository
                .countByQuoteRequest_RequestId(quoteRequest.getRequestId());

        return QuoteRequestResDTO.from(quoteRequest, (int) estimateCount);
    }

    /**
     * 모든 견적 요청 목록을 조회하여 DTO 리스트로 변환하여 반환합니다.
     */
    public List<QuoteRequestResDTO> getAvailableQuoteRequests() {
        List<QuoteRequest> quoteRequests = quoteRequestRepository.findAllWithDetails();

        return quoteRequests.stream()
                .map(this::convertToDtoWithDetails)
                .collect(Collectors.toList());
    }
}