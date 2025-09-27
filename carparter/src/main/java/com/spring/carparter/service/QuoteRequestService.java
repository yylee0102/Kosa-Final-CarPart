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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuoteRequestService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final UserRepository userRepository;
    private final UserCarRepository userCarRepository;
    private final S3Service s3Service;
    private final EstimateRepository estimateRepository;

    /**
     * 사용자 견적요청 생성 (+이미지 업로드)
     */
    @Transactional
    public QuoteRequestResDTO createQuoteRequestWithImages(
            String userId,
            QuoteRequestReqDTO request,
            List<MultipartFile> images
    ) {
        // 1) User / UserCar 조회
        User user = userRepository.findByUserId(userId);
        if(user == null){
            throw  new EntityNotFoundException("사용자를 찾을수 없습니다."+userId);
        }

        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> new EntityNotFoundException("사용자 차량을 찾을 수 없습니다: " + request.getUserCarId()));

        // 2) 엔티티 변환
        QuoteRequest quoteRequest = request.toEntity(request, user, userCar);

        // 3) 이미지 S3 업로드 → RequestImage 추가
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file == null || file.isEmpty()) continue;

                String originalFilename = file.getOriginalFilename();
                String objectKey = "requests/" + UUID.randomUUID() + "_" + (originalFilename == null ? "noname" : originalFilename);

                try {
                    s3Service.uploadFile(file, objectKey);

                    RequestImage requestImage = RequestImage.builder()
                            .imageUrl(objectKey) // DB에는 objectKey 저장
                            .build();

                    quoteRequest.addRequestImage(requestImage);

                } catch (Exception e) {
                    throw new RuntimeException("S3 파일 업로드에 실패했습니다.", e);
                }
            }
        }

        // 4) 저장
        QuoteRequest saved = quoteRequestRepository.save(quoteRequest);

        // 5) DTO 변환
        return convertToDtoWithDetails(saved);
    }

    /**
     * (호환용) 이미지 없이 생성하는 기존 진입점
     */
    @Transactional
    public QuoteRequest createAndSaveQuoteRequest(QuoteRequestReqDTO request) {
        User user = userRepository.findByUserId(request.getUserId());
        if(user == null){
            throw  new EntityNotFoundException("사용자를 찾을수 없습니다."+request.getUserId());
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
     * [수정] N+1 성능 문제를 해결했습니다.
     * 기존 메소드 이름은 그대로 유지합니다.
     */
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getAllQuoteRequests() {
        return quoteRequestRepository.findAllWithDetails()
                .stream()
                .map(quoteRequest -> {
                    int estimateCount = quoteRequest.getEstimates() != null ? quoteRequest.getEstimates().size() : 0;
                    return QuoteRequestResDTO.from(quoteRequest, estimateCount);
                })
                .collect(Collectors.toList());
    }


    /** 아이디로 상세 */
    @Transactional(readOnly = true)
    public QuoteRequestResDTO getQuoteRequestDetails(Integer requestId) {
        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("견적 요청을 찾을 수 없습니다: " + requestId));
        return convertToDtoWithDetails(quoteRequest);
    }

    // --------------------------------------------------------------------
    // ▼▼▼ 카센터 관점 조회 추가 (요청하신 부분) ▼▼▼
    // --------------------------------------------------------------------

    /**
     * [수정] N+1 성능 문제를 해결하고, centerId 타입을 String으로 통일했습니다.
     * 기존 메소드 이름은 그대로 유지합니다.
     */
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getQuoteRequestsForCenter(String centerId) { // [수정] Long -> String
        return quoteRequestRepository.findAllWithDetails().stream()
                .map(qr -> {
                    // [수정] DB 쿼리 대신 메모리에서 사이즈 계산
                    int estimateCount = qr.getEstimates() != null ? qr.getEstimates().size() : 0;
                    return QuoteRequestResDTO.from(qr, estimateCount);
                })
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

    // --------------------------------------------------------------------
    // ▲▲▲ 카센터 관점 조회 추가 (요청하신 부분) ▲▲▲
    // --------------------------------------------------------------------

    /**
     * 공통: 엔티티→DTO 변환 + 부가정보(견적 개수, Pre-signed URL) 처리
     */
    private QuoteRequestResDTO convertToDtoWithDetails(QuoteRequest quoteRequest) {
        // 1) 견적 개수
        int estimateCount = estimateRepository
                .countByQuoteRequest_RequestId(quoteRequest.getRequestId())
                .intValue();

        // 2) 기본 DTO
        QuoteRequestResDTO dto = QuoteRequestResDTO.from(quoteRequest, estimateCount);

        // 3) (옵션) presigned URL 치환
        // dto.getImages().forEach(image -> {
        //     String presignedUrl = s3Service.createPresignedUrl(image.getImageUrl());
        //     image.setImageUrl(presignedUrl);
        // });

        return dto;
    }

    /**
     * 모든 견적 요청 목록을 조회하여 DTO 리스트로 변환하여 반환합니다.
     */
    public List<QuoteRequestResDTO> getAvailableQuoteRequests() {
        List<QuoteRequest> quoteRequests = quoteRequestRepository.findAllWithDetails();

        return quoteRequests.stream()
                .map(quoteRequest -> {
                    int estimateCount = quoteRequest.getEstimates() != null ? quoteRequest.getEstimates().size() : 0;
                    return QuoteRequestResDTO.from(quoteRequest, estimateCount);
                })
                .collect(Collectors.toList());
    }
}