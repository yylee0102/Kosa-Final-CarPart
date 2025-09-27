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

    /**
     * ✅ QuoteRequest 엔티티를 QuoteRequestResDTO로 변환하는 정적 팩토리 메서드
     */
    public static QuoteRequestResDTO from(QuoteRequest quoteRequest) {
        // [수정] quoteRequest 객체에서 User와 UserCar 정보를 가져옵니다.
        User user = quoteRequest.getUser();
        UserCar car = quoteRequest.getUserCar();

        return QuoteRequestResDTO.builder()
                .requestId(quoteRequest.getRequestId())
                .requestDetails(quoteRequest.getRequestDetails())
                .address(quoteRequest.getAddress())
                .createdAt(quoteRequest.getCreatedAt())
                // [수정] user 객체에서 이름과 전화번호를 가져옵니다.
                .customerName(user.getName())
                .customerPhone(user.getPhoneNumber()) // User 엔티티에 getPhoneNumber()가 있다고 가정
                // [수정] car 객체에서 모델명과 연식을 가져옵니다.
                .carModel(car.getCarModel()) // UserCar 엔티티에 getCarModel()가 있다고 가정
                .carYear(car.getModelYear()) // UserCar 엔티티에 getModelYear()가 있다고 가정
                .status("PENDING") // 엔티티에 status 필드가 있다면 그 값을 사용
                .imageUrls(quoteRequest.getRequestImages().stream()
                        .map(RequestImage::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }

    // 💡 [삭제] 불필요하고 잘못된 위치에 있던 WriterInfo 클래스와 from 메서드를 제거했습니다.

    // 💡 [수정] 아래 내부 클래스들을 QuoteRequestResDTO 클래스 안으로 이동시켰습니다.
    
    // UserCar 엔티티를 CarInfo DTO로 변환하는 내부 DTO (현재는 사용되지 않으나 구조상 유지)
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

    // RequestImage 엔티티를 ImageInfo DTO로 변환하는 내부 DTO (현재는 사용되지 않으나 구조상 유지)
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
} // ✅ [수정] 클래스의 끝을 나타내는 괄호를 파일의 가장 마지막으로 이동시켰습니다.