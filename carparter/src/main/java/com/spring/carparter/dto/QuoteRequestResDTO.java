package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.service.S3Service;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
@Getter
@Builder
public class QuoteRequestResDTO {

    // 주요 요청 정보
    private final Integer requestId;
    private final String requestDetails;
    private final String address;
    private final LocalDateTime createdAt;
    private final int estimateCount;

    // 더 나은 구조를 위한 중첩 객체
//    private final WriterDTO writer;
    private final UserCarResDTO car;
//    private final List<ImageDTO> images;
    private final List<EstimateResDTO> estimates;

    /**
     * QuoteRequest 엔티티를 QuoteRequestResDTO로 변환하는 정적 팩토리 메서드
     *
     * @param quoteRequest 원본 엔티티
     * @param estimateCount 관련된 견적의 개수
     * @param s3Service S3 Pre-signed URL 생성을 위한 서비스
     * @return 새로운 QuoteRequestResDTO 인스턴스
     */
    public static QuoteRequestResDTO from(QuoteRequest quoteRequest, int estimateCount, S3Service s3Service) {
        // quoteRequest가 null일 경우를 대비하여 null을 반환합니다.
        if (quoteRequest == null) {
            return null;
        }

        // Estimate 엔티티 목록을 EstimateResDTO 목록으로 변환합니다. null일 경우 빈 리스트를 반환합니다.
        List<EstimateResDTO> estimateDTOs = quoteRequest.getEstimates() == null ? Collections.emptyList() :
                quoteRequest.getEstimates().stream()
                        .map(EstimateResDTO::from)
                        .collect(Collectors.toList());

        // RequestImage 엔티티 목록을 ImageDTO 목록으로 변환합니다. null일 경우 빈 리스트를 반환합니다.
        // TODO: s3Service를 사용하여 이미지 URL을 Pre-signed URL로 변환하는 로직을 추가할 수 있습니다.
//        List<ImageDTO> imageDTOs = quoteRequest.getRequestImages() == null ? Collections.emptyList() :
                quoteRequest.getRequestImages().stream()
//                        .map(ImageDTO::from) // ImageDTO에 'from' 메서드가 있다고 가정
                        .collect(Collectors.toList());

        // 빌더 패턴을 사용하여 DTO 객체를 생성하고 반환합니다.
        return QuoteRequestResDTO.builder()
                .requestId(quoteRequest.getRequestId())
                .requestDetails(quoteRequest.getRequestDetails())
                .address(quoteRequest.getAddress())
                .createdAt(quoteRequest.getCreatedAt())
                .estimateCount(estimateCount)
//                .writer(WriterDTO.from(quoteRequest.getUser()))       // 중첩된 writer DTO 생성
                .car(UserCarResDTO.from(quoteRequest.getUserCar()))   // 중첩된 car DTO 생성
                .estimates(estimateDTOs)
//                .images(imageDTOs)
                .build();
    }
}