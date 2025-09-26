package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.RequestImage;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class QuoteRequestResDTO {

    private final Integer requestId;
    private final String requestDetails;
    private final String address;
    private final Double latitude;
    private final Double longitude;
    private final LocalDateTime createdAt;
    private final WriterInfo writer; // 작성자 정보 (내부 DTO)
    private final CarInfo car; // 차량 정보 (내부 DTO)
    private final List<ImageInfo> images; // 요청 이미지 목록 (내부 DTO)
    private final int estimateCount; // 받은 견적 개수

    // User 엔티티를 WriterInfo DTO로 변환하는 내부 DTO
    @Getter
    @Builder
    private static class WriterInfo {
        private final String userId;
        private final String name;

        static WriterInfo from(User user) {
            return WriterInfo.builder()
                    .userId(user.getUserId())
                    .name(user.getName())
                    .build();
        }
    }

    // UserCar 엔티티를 CarInfo DTO로 변환하는 내부 DTO
    @Getter
    @Builder
    private static class CarInfo {
        private final Long userCarId;
        // private final String modelName; // 예시: UserCar에 모델명 필드가 있다고 가정
        // private final int year; // 예시: UserCar에 연식 필드가 있다고 가정

        static CarInfo from(UserCar userCar) {
            return CarInfo.builder()
                    .userCarId(userCar.getUserCarId()) // UserCar의 ID 필드명에 맞게 수정 필요
                    // .modelName(userCar.getModelName())
                    // .year(userCar.getYear())
                    .build();
        }
    }

    // RequestImage 엔티티를 ImageInfo DTO로 변환하는 내부 DTO
    @Getter
    @Builder
    private static class ImageInfo {
        private final int imageId;
        private final String imageUrl;

        static ImageInfo from(RequestImage image) {
            return ImageInfo.builder()
                    .imageId(image.getImageId()) // RequestImage의 ID 필드명에 맞게 수정 필요
                    .imageUrl(image.getImageUrl()) // RequestImage의 URL 필드명에 맞게 수정 필요
                    .build();
        }
    }


    /**
     * QuoteRequest 엔티티를 QuoteRequestRes DTO로 변환하는 정적 팩토리 메서드
     */
    public static QuoteRequestResDTO from(QuoteRequest quoteRequest, int estimateCount) {
        return QuoteRequestResDTO.builder()
                .requestId(quoteRequest.getRequestId())
                .requestDetails(quoteRequest.getRequestDetails())
                .address(quoteRequest.getAddress())
                .latitude(quoteRequest.getLatitude())
                .longitude(quoteRequest.getLongitude())
                .createdAt(quoteRequest.getCreatedAt())
                .writer(WriterInfo.from(quoteRequest.getUser()))
                .car(CarInfo.from(quoteRequest.getUserCar()))
                .images(quoteRequest.getRequestImages().stream()
                        .map(ImageInfo::from)
                        .collect(Collectors.toList()))
                .build();
    }
}