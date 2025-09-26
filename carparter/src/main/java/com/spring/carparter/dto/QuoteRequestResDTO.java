package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.RequestImage;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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
    private final WriterInfo writer;
    private final CarInfo car;
    private final List<ImageInfo> images;
    private final int estimateCount;

    @Getter
    @Builder
    public static class WriterInfo {
        private final String userId;
        private final String name;

        static WriterInfo from(User user) {
            return WriterInfo.builder()
                    .userId(user.getUserId())
                    .name(user.getName())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class CarInfo {
        // UserCar의 ID가 Long 타입일 가능성이 높으므로 Long으로 맞춰줍니다.
        private final Long userCarId;

        static CarInfo from(UserCar userCar) {
            return CarInfo.builder()
                    .userCarId(userCar.getUserCarId()) // 보통 엔티티의 PK 필드명은 id 입니다. userCarId라면 그대로 두세요.
                    .build();
        }
    }

    @Getter
    @Builder
    public static class ImageInfo {
        private final Integer imageId;
        @Setter
        private String imageUrl;

        static ImageInfo from(RequestImage image) {
            return ImageInfo.builder()
                    .imageId(image.getImageId())
                    .imageUrl(image.getImageUrl())
                    .build();
        }
    }

    /**
     * QuoteRequest 엔티티와 외부에서 계산된 estimateCount를 받아 DTO를 생성합니다.
     * @param quoteRequest 원본 엔티티
     * @param estimateCount 서비스 레이어에서 효율적으로 계산한 견적 개수
     * @return 생성된 DTO
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
                .estimateCount(estimateCount) // 파라미터로 받은 값을 사용
                .build();
    }
}