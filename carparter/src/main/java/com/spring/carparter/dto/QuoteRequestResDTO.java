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
@Setter
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
    private int estimateCount; // [추가] 견적 개수 필드

    /**
     * ✅ QuoteRequest 엔티티를 QuoteRequestResDTO로 변환하는 정적 팩토리 메서드
     */
    // [수정] int estimateCount 파라미터를 추가하여 서비스 계층의 호출과 일치시켰습니다.
    public static QuoteRequestResDTO from(QuoteRequest quoteRequest, int estimateCount) {
        User user = quoteRequest.getUser();
        UserCar car = quoteRequest.getUserCar();

        return QuoteRequestResDTO.builder()
                .requestId(quoteRequest.getRequestId())
                .requestDetails(quoteRequest.getRequestDetails())
                .address(quoteRequest.getAddress())
                .createdAt(quoteRequest.getCreatedAt())
                .customerName(user.getName())
                .customerPhone(user.getPhoneNumber())
                .carModel(car.getCarModel())
                .carYear(car.getModelYear())
                .imageUrls(quoteRequest.getRequestImages().stream()
                        .map(RequestImage::getImageUrl)
                        .collect(Collectors.toList()))
                .estimateCount(estimateCount) // [추가] 전달받은 견적 개수 매핑
                .build();
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