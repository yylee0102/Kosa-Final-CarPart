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

    @Transactional
    public QuoteRequestResDTO createQuoteRequestWithImages(String userId, QuoteRequestReqDTO request, List<MultipartFile> images) {
        // 1. 사용자(User)와 사용자 차량(UserCar) 엔티티를 조회합니다.
        User user = userRepository.findByUserId(userId);

        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> new EntityNotFoundException("사용자 차량을 찾을 수 없습니다: " + request.getUserCarId()));

        // 2. DTO를 QuoteRequest 엔티티로 변환합니다. (아직 DB에 저장 전)
        QuoteRequest quoteRequest = request.toEntity(request, user, userCar);

        // 3. 이미지 파일들을 S3에 업로드하고, RequestImage 엔티티를 생성하여 QuoteRequest에 추가합니다.
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (file.isEmpty()) continue;

                // 파일명이 중복되지 않도록 UUID를 사용하여 고유한 파일 이름 생성
                String originalFilename = file.getOriginalFilename();
                String objectKey = "requests/" + UUID.randomUUID().toString() + "_" + originalFilename;

                try {
                    // S3에 파일 업로드
                    s3Service.uploadFile(file, objectKey);

                    // RequestImage 엔티티 생성
                    RequestImage requestImage = RequestImage.builder()
                            .imageUrl(objectKey) // DB에는 파일 이름(객체 키)만 저장
                            .build();

                    // 연관관계 편의 메소드를 사용하여 QuoteRequest에 추가 (JPA가 함께 저장해줌)
                    quoteRequest.addRequestImage(requestImage);

                } catch (Exception e) {
                    // RuntimeException으로 감싸서 트랜잭션 롤백을 유도
                    throw new RuntimeException("S3 파일 업로드에 실패했습니다.", e);
                }
            }
        }

        // 4. QuoteRequest 엔티티를 DB에 저장합니다. (Cascade 설정 덕분에 RequestImage도 함께 저장됨)
        QuoteRequest savedQuoteRequest = quoteRequestRepository.save(quoteRequest);

        // 5. 저장된 엔티티를 DTO로 변환하여 반환합니다. (Pre-signed URL 포함)
        return convertToDtoWithDetails(savedQuoteRequest);
    }

    // 견적 요청 생성 (이 메소드는 문제 없으므로 그대로 사용)
    @Transactional
    public QuoteRequest createAndSaveQuoteRequest(QuoteRequestReqDTO request) {
        User user = userRepository.findByUserId(request.getUserId());

        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> new IllegalArgumentException("UserCar not found with id: " + request.getUserCarId()));

        QuoteRequest quoteRequest = request.toEntity(request, user, userCar);

        return quoteRequestRepository.save(quoteRequest);
    }

    // 견적 요청 삭제 (문제 없음)
    @Transactional
    public void deleteQuoteRequest(Integer quoteRequestId){
        quoteRequestRepository.deleteById(quoteRequestId);
    }

    // 견적 요청 단건 조회 (엔티티 반환, 문제 없음)
    public QuoteRequest getQuoteRequest(Integer quoteRequestId){
        return quoteRequestRepository.findById(quoteRequestId).orElseThrow();
    }

    // ✅ [수정] 특정 사용자의 견적 요청서를 DTO로 가져오는 함수
    @Transactional(readOnly = true)
    public QuoteRequestResDTO getQuoteRequestByUser(String userId) {
        QuoteRequest quoteRequest = quoteRequestRepository.findByUser_UserId(userId);

        // ✅ 중복 로직을 처리하는 도우미 메소드(helper method)를 호출합니다.
        return convertToDtoWithDetails(quoteRequest);
    }

    // ✅ [수정] 모든 견적 요청서 목록을 DTO로 가져오는 함수
    // (이름을 getQuoteRequestsByCenter -> getAllQuoteRequests로 변경하여 역할을 명확히 함)
    @Transactional(readOnly = true)
    public List<QuoteRequestResDTO> getAllQuoteRequests() {
        List<QuoteRequest> quoteRequests = quoteRequestRepository.findAll();

        return quoteRequests.stream()
                .map(this::convertToDtoWithDetails) // ✅ 각 요청에 대해 도우미 메소드를 호출합니다.
                .collect(Collectors.toList());
    }

    // ✅ [수정] ID로 특정 견적 요청 상세 정보를 DTO로 가져오는 함수
    @Transactional(readOnly = true)
    public QuoteRequestResDTO getQuoteRequestDetails(Integer requestId) {
        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("견적 요청을 찾을 수 없습니다: " + requestId));

        // ✅ 중복 로직을 처리하는 도우미 메소드를 호출합니다.
        return convertToDtoWithDetails(quoteRequest);
    }

    /**
     * ✅ [신규 추가] DTO 변환 및 상세 정보(견적 개수, Pre-signed URL) 추가를 위한 도우미 메소드
     * 중복되는 코드를 이 메소드로 통합하여 관리합니다.
     * @param quoteRequest 변환할 QuoteRequest 엔티티
     * @return 상`세 정보가 포함된 QuoteRequestResDTO
     */
    private QuoteRequestResDTO convertToDtoWithDetails(QuoteRequest quoteRequest) {
        // 1. Repository count 메소드로 효율적으로 개수 조회
        int estimateCount = estimateRepository.countByQuoteRequest_RequestId(quoteRequest.getRequestId()).intValue();

        // 2. 수정된 from 메소드를 사용하여 DTO 기본 생성
        QuoteRequestResDTO dto = QuoteRequestResDTO.from(quoteRequest, estimateCount);

        // 3. Pre-signed URL 생성 및 DTO에 설정
        dto.getImages().forEach(image -> {
            String presignedUrl = s3Service.createPresignedUrl(image.getImageUrl());
            image.setImageUrl(presignedUrl);
        });

        return dto;
    }
}