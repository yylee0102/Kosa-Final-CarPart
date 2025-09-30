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


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
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

            for (MultipartFile file : images) {
                if (file == null || file.isEmpty()) continue;

                // QuoteRequestService.java

                // ...
                // 3) 이미지 S3 업로드 → RequestImage 추가 (임시 처리)
                if (images != null && !images.isEmpty()) {
                    for (MultipartFile fille : images) {
                        if (fille == null || fille.isEmpty()) continue;

                        // ▼▼▼▼▼ [수정] S3 업로드 로직을 주석 처리하고 임시 코드로 대체합니다. ▼▼▼▼▼

                        // String originalFilename = file.getOriginalFilename();
                        // String objectKey = "requests/" + UUID.randomUUID() + "_" + (originalFilename == null ? "noname" : originalFilename);
                        //
                        // try {
                        //     s3Service.uploadFile(file, objectKey);
                        //
                        //     RequestImage requestImage = RequestImage.builder()
                        //             .imageUrl(objectKey)
                        //             .build();
                        //
                        //     quoteRequest.addRequestImage(requestImage);
                        //
                        // } catch (Exception e) {
                        //     throw new RuntimeException("S3 파일 업로드에 실패했습니다.", e);
                        // }

                        // ✅ [추가] 임시 이미지 URL을 생성하는 코드
                        RequestImage tempRequestImage = RequestImage.builder()
                                .imageUrl("1111") // 요청하신 임시 데이터 "1111"을 저장
                                .build();

                        quoteRequest.addRequestImage(tempRequestImage);

                        // ▲▲▲▲▲ 여기까지 수정 ▲▲▲▲▲

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
    /**
     * [임시] 이미지 없는 견적 요청 생성
     * S3 연동 전, 이미지 관련 로직을 모두 제거한 버전입니다.
     */
    @Transactional
    public QuoteRequestResDTO createQuoteRequest(String userId, QuoteRequestReqDTO request) {

        // ✅ [디버깅 로그 추가] 1. 메서드에 전달된 userId가 정확한지 확인
        log.info("========= 견적 요청 생성 시작 (이미지 없음): 사용자 ID '{}' =========", userId);

        // ✅ 2. 기존 요청서가 있는지 확인 (중복 생성 방지 로직 유지)
        if (quoteRequestRepository.existsByUser_UserId(userId)) {
            log.error(">>>>>> DB에서 기존 요청 데이터를 찾았습니다! 사용자 ID: {}", userId);
            throw new IllegalStateException("이미 등록된 견적 요청서가 존재합니다.");
        } else {
            log.info(">>>>>> DB에 기존 요청 데이터가 없습니다. 새로운 요청 생성을 계속합니다.");

        }

        try {
            // ✅ 3. 관련 엔티티 조회 (유지)
            User user = userRepository.findByUserId(userId);
            UserCar userCar = userCarRepository.findById(request.getUserCarId())
                    .orElseThrow(() -> new EntityNotFoundException("사용자 차량을 찾을 수 없습니다: " + request.getUserCarId()));

            // ✅ 4. 견적 요청 엔티티 생성 (유지)
            QuoteRequest quoteRequest = request.toEntity(request, user, userCar);

            // ❗️ [제거] S3 업로드 및 이미지 처리와 관련된 모든 로직을 제거했습니다.

            // ✅ 5. 견적 요청서 DB에 저장 (유지)
            QuoteRequest savedQuoteRequest = quoteRequestRepository.save(quoteRequest);
            log.info("견적 요청서 DB 저장 성공. Request ID: {}", savedQuoteRequest.getRequestId());

            // ✅ 6. [수정] DTO에 이미 만들어져 있는 from() 메서드를 사용하여 한 줄로 변환
            return QuoteRequestResDTO.from(savedQuoteRequest, 0); // 새로 생성했으므로 견적 개수는 0

        } catch (Exception e) {
            log.error("DB 저장 중 예외 발생.", e);
            throw new RuntimeException("데이터베이스 처리 중 오류가 발생하여 요청이 취소되었습니다.", e);
        }
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
z        List<QuoteRequest> quoteRequests = quoteRequestRepository.findAllWithDetails();

        return quoteRequests.stream()
                .map(this::convertToDtoWithDetails)
                .collect(Collectors.toList());
    }

    /**
     * ✅ [신규 추가] 내 견적 요청 조회 서비스
     */
    @Transactional(readOnly = true)
    public QuoteRequestResDTO getMyQuoteRequest(String userId) {
        // ✅ 수정한 Repository 메소드를 호출합니다.
        QuoteRequest quoteRequest = quoteRequestRepository.findByUserIdWithDetails(userId)
                .orElse(null); // 없으면 null을 반환

        if (quoteRequest == null) {
            return null;
        }

        // JOIN FETCH로 모든 데이터를 미리 가져왔기 때문에 DTO 변환이 안전합니다.
        return QuoteRequestResDTO.from(quoteRequest, quoteRequest.getEstimates().size());
    }

}