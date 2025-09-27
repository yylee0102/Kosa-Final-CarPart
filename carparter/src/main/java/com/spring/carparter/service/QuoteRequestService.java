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
        if (user == null) throw new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId);

        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> new EntityNotFoundException("사용자 차량을 찾을 수 없습니다: " + request.getUserCarId()));

        // 2) 엔티티 변환
        // (toEntity 시그니처는 프로젝트에 맞게 유지)
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

        // 5) DTO 변환(필요시 pre-signed URL 부여는 convertToDtoWithDetails 내부에서 처리 가능)
        return convertToDtoWithDetails(saved);
    }

    /**
     * (호환용) 이미지 없이 생성하는 기존 진입점
     */
    @Transactional
    public QuoteRequest createAndSaveQuoteRequest(QuoteRequestReqDTO request) {
        User user = userRepository.findByUserId(request.getUserId());
        if (user == null) throw new EntityNotFoundException("사용자를 찾을 수 없습니다: " + request.getUserId());

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
        return quoteRequestRepository.findById(quoteRequestId).orElseThrow();
    }

//    /** ✅ 사용자 기준: 내 견적요청 단건 조회 (컨트롤러에서 사용) */
//    @Transactional(readOnly = true)
//    public QuoteRequestResDTO getQuoteRequestByUser(String userId) {
//        QuoteRequest quoteRequest = quoteRequestRepository.findByUser_UserId(userId);
//        if (quoteRequest == null) throw new EntityNotFoundException("사용자의 견적 요청이 없습니다: " + userId);
//        return convertToDtoWithDetails(quoteRequest);
//    }

    /** 전체 목록 */
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getAllQuoteRequests() {
        return quoteRequestRepository.findAll()
                .stream()
                .map(this::convertToDtoWithDetails)
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
     * ✅ 카센터용: 견적요청 리스트 조회 (+ 이 센터가 이미 견적 보냈는지 플래그)
     *
     * @param centerId 카센터 PK
     * @return 각 요청의 DTO (estimateCount 포함) + 이미 내가 견적 제출했는지 여부
     *
     * 필요 리포지토리 메서드 (EstimateRepository)에 아래 시그니처가 있어야 합니다.
     * boolean existsByQuoteRequest_RequestIdAndCarCenter_CenterId(Integer requestId, Long centerId);
     */
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getQuoteRequestsForCenter(Long centerId) {
        // 정책이 정해져 있지 않다면 우선 "전체 요청"을 보여주고,
        // 각 요청에 대해 '이미 내가 견적 제출했는지'만 계산합니다.
        return quoteRequestRepository.findAll().stream()
                .map(qr -> {
                    QuoteRequestResDTO dto = convertToDtoWithDetails(qr);

                    // (선택) dto에 center-specific 정보(예: alreadyEstimatedByMe) 실어보내고 싶다면
                    // DTO를 확장하거나, 별도 뷰 모델을 만들어야 합니다.
                    // 여기서는 예시로 images의 첫 url에 쿼리파라미터를 넣는 등의 꼼수는 지양하고,
                    // 필요한 경우 DTO 확장 권장.
                    // → 당장은 컨트롤러에서 별도 응답 래핑을 추천합니다.

                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * ✅ 카센터용: 특정 요청 상세 + "이미 내가 견적 제출했는지" 여부 반환
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
        //   - 지금 주석 처리 상태를 유지합니다. 필요 시 주석 해제.
        // dto.getImages().forEach(image -> {
        //     String presignedUrl = s3Service.createPresignedUrl(image.getImageUrl());
        //     image.setImageUrl(presignedUrl);
        // });

        return dto;
    }

    /**
     * [이름 변경] 모든 견적 요청 목록을 조회하여 DTO 리스트로 변환하여 반환합니다.
     * @return 모든 견적 요청 DTO 리스트
     */
    public List<QuoteRequestResDTO> getAvailableQuoteRequests() { // ⬅️ 이름 변경

        List<QuoteRequest> quoteRequests = quoteRequestRepository.findAllWithDetails();

        return quoteRequests.stream()
                .map(quoteRequest -> {
                    int estimateCount = quoteRequest.getEstimates() != null ? quoteRequest.getEstimates().size() : 0;
                    return QuoteRequestResDTO.from(quoteRequest, estimateCount);
                })
                .collect(Collectors.toList());
    }
}
