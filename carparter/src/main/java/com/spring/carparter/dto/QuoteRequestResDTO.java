package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.RequestImage;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import com.spring.carparter.service.S3Service; // S3Service를 사용하기 위해 임포트합니다.
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class QuoteRequestResDTO {
    private Integer requestId;
    private String requestDetails;
    private String address;
    private LocalDateTime createdAt;
    private String customerName;
    private String customerPhone;
    private String carModel;
    private Integer carYear;
    private String preferredDate;
    private String status;
    private List<String> imageUrls;
    private int estimateCount;

    /**
     * ✅ QuoteRequest 엔티티를 QuoteRequestResDTO로 변환하는 정적 팩토리 메서드
     * S3Service를 파라미터로 받아 Pre-signed URL을 생성합니다.
     */
    public static QuoteRequestResDTO from(QuoteRequest quoteRequest, int estimateCount, S3Service s3Service) {
        User user = quoteRequest.getUser();
        UserCar car = quoteRequest.getUserCar();

        // 파라미터로 전달받은 s3Service를 사용하여 Pre-signed URL 리스트를 생성합니다.
        List<String> presignedImageUrls = (quoteRequest.getRequestImages() == null)
                ? new ArrayList<>()
                : quoteRequest.getRequestImages().stream()
                .map(image -> s3Service.createPresignedUrl(extractObjectKeyFromUrl(image.getImageUrl())))
                .collect(Collectors.toList());

        return QuoteRequestResDTO.builder()
                .requestId(quoteRequest.getRequestId())
                .requestDetails(quoteRequest.getRequestDetails())
                .address(quoteRequest.getAddress())
                .createdAt(quoteRequest.getCreatedAt())
                .customerName(user.getName())
                .customerPhone(user.getPhoneNumber())
                .carModel(car.getCarModel())
                .carYear(car.getModelYear())
                .imageUrls(presignedImageUrls) // Pre-signed URL이 담긴 리스트를 반환합니다.
                .estimateCount(estimateCount)
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

    // 아래 내부 클래스들은 현재 직접 사용되지는 않지만, 구조상 유지합니다.
    @Getter
    @Builder
    private static class CarInfo {
        private final Long userCarId;

        static CarInfo from(UserCar userCar) {
            return CarInfo.builder()
                    .userCarId(userCar.getUserCarId())
                    .build();
        }
    }

    @Getter
    @Builder
    private static class ImageInfo {
        private final int imageId;
        private final String imageUrl;

        static ImageInfo from(RequestImage image) {
            return ImageInfo.builder()
                    .imageId(image.getImageId())
                    .imageUrl(image.getImageUrl())
                    .build();
        }
    }
}