package com.spring.carparter.dto;

import com.spring.carparter.entity.UsedPart;
import com.spring.carparter.service.S3Service; // S3Service 임포트
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class UsedPartResDTO {

    private Integer partId;
    private String centerId;
    private String partName;
    private String description;
    private Integer price;
    private String category;
    private String compatibleCarModel;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
    private String centerPhoneNumber;

    /**
     * UsedPart 엔티티를 UsedPartResDTO로 변환하는 정적 팩토리 메소드.
     * S3Service를 사용하여 이미지 URL을 Pre-signed URL로 변환합니다.
     *
     * @param usedPart 변환할 UsedPart 엔티티
     * @param s3Service Pre-signed URL 생성을 위한 S3Service 인스턴스
     * @return 변환된 UsedPartResDTO 객체
     */
    public static UsedPartResDTO from(UsedPart usedPart, S3Service s3Service) {
        return UsedPartResDTO.builder()
                .partId(usedPart.getPartId())
                .centerId(usedPart.getCarCenter().getCenterId())
                .partName(usedPart.getPartName())
                .description(usedPart.getDescription())
                .price(usedPart.getPrice())
                .category(usedPart.getCategory())
                .compatibleCarModel(usedPart.getCompatibleCarModel())
                .createdAt(usedPart.getCreatedAt())
                // DB에 저장된 각 이미지의 원본 URL을 Pre-signed URL로 변환합니다.
                .imageUrls(usedPart.getImages().stream()
                        .map(image -> s3Service.createPresignedUrl(extractObjectKeyFromUrl(image.getImageUrl())))
                        .collect(Collectors.toList()))
                .centerPhoneNumber(usedPart.getCarCenter().getPhoneNumber())

                .build();
    }

    /**
     * 전체 S3 URL에서 객체 키(버킷 내 파일 경로)만 추출하는 헬퍼 메소드.
     * @param fileUrl 전체 파일 URL
     * @return S3 객체 키
     */
    private static String extractObjectKeyFromUrl(String fileUrl) {
        try {
            // 예: https://[bucket-name].s3.[region].amazonaws.com/[objectKey]
            // .com/ 이후의 문자열(objectKey)을 반환합니다.
            return fileUrl.substring(fileUrl.indexOf(".com/") + 5);
        } catch (Exception e) {
            // URL 형식이 예상과 다를 경우, 오류 방지를 위해 빈 문자열 반환
            return "";
        }
    }
}