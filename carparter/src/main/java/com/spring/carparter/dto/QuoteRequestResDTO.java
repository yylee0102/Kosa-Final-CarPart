// 파일 경로: com/spring/carparter/dto/QuoteRequestResDTO.java

package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.RequestImage;
import com.spring.carparter.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class QuoteRequestResDTO {

    // ✅ 최종적으로 정리된 필드들
    private Integer requestId;
    private String requestDetails;
    private String address;
    private LocalDateTime createdAt;
    private int estimateCount;

    // ✅ 작성자와 차량 정보를 담을 중첩 객체 필드
    private final WriterDTO writer;
    private final UserCarResDTO car; // UserCarResDTO를 그대로 사용
    private final List<ImageDTO> images;

    /**
     * 엔티티를 DTO로 변환하는 private 생성자.
     * 정적 팩토리 메소드 'from'을 통해서만 호출됩니다.
     */

    private QuoteRequestResDTO(QuoteRequest entity, int estimateCount) {
        this.requestId = entity.getRequestId();
        this.requestDetails = entity.getRequestDetails();
        this.address = entity.getAddress();
        this.createdAt = entity.getCreatedAt();
        this.estimateCount = estimateCount;

        // ▼▼▼▼▼ 핵심 수정 부분 ▼▼▼▼▼
        // 1. WriterDTO 객체를 생성하여 writer 필드를 채웁니다.
        this.writer = WriterDTO.from(entity.getUser());

        // 2. UserCarResDTO의 from 메소드를 호출하여 car 필드를 채웁니다.
        this.car = UserCarResDTO.from(entity.getUserCar());
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        // 3. 이미지 정보도 ImageDTO 리스트로 변환하여 채웁니다.
        this.images = entity.getRequestImages().stream()
                .map(ImageDTO::from)
                .collect(Collectors.toList());

    }

    /**
     * 외부에서 DTO를 생성할 때 사용하는 정적 팩토리 메소드
     */
    public static QuoteRequestResDTO from(QuoteRequest entity, int estimateCount) {
        return new QuoteRequestResDTO(entity, estimateCount);
    }


    // =================== 중첩 DTO 클래스들 ===================

    @Getter
    private static class WriterDTO {
        private final String userId;
        private final String name;

        private WriterDTO(User user) {
            this.userId = user.getUserId();
            this.name = user.getName();
        }

        public static WriterDTO from(User user) {
            return new WriterDTO(user);
        }
    }

    @Getter
    private static class ImageDTO {
        private final int imageId;
        private final String imageUrl;

        private ImageDTO(RequestImage image) {
            this.imageId = image.getImageId();
            this.imageUrl = image.getImageUrl();
        }

        public static ImageDTO from(RequestImage image) {
            return new ImageDTO(image);
        }
    }
}