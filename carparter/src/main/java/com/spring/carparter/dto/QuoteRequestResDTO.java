package com.spring.carparter.dto;

import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.RequestImage;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class QuoteRequestResDTO {

    // --- 프론트엔드와 일치하는 최종 필드 ---
    private final Integer requestId;
    private final String requestDetails;
    private final String address;
    private final LocalDateTime createdAt;
    private int estimateCount;

    // [핵심 수정] 프론트엔드가 사용하는 이름과 구조로 변경
    private final String customerName;
    private final String customerPhone;
    private final UserCarResDTO userCar;       // ⬅️ 필드 이름 변경 (car -> userCar)
    private final List<String> imageUrls;   // ⬅️ 필드 이름 및 타입 변경 (images -> imageUrls)
    private final List<EstimateResDTO> estimates;


    /**
     * 엔티티를 DTO로 변환하는 생성자
     */
    private QuoteRequestResDTO(QuoteRequest entity, int estimateCount) {
        this.requestId = entity.getRequestId();
        this.requestDetails = entity.getRequestDetails();
        this.address = entity.getAddress();
        this.createdAt = entity.getCreatedAt();
        this.estimateCount = estimateCount;

        // [핵심 수정] 연관 엔티티에서 데이터를 직접 추출하여 필드 설정
        if (entity.getUser() != null) {
            this.customerName = entity.getUser().getName();
            this.customerPhone = entity.getUser().getPhoneNumber(); // User 엔티티에 getPhoneNumber() 필요
        } else {
            this.customerName = "정보 없음";
            this.customerPhone = "정보 없음";
        }

        this.userCar = UserCarResDTO.from(entity.getUserCar());

        this.imageUrls = (entity.getRequestImages() == null) ? Collections.emptyList() :
                entity.getRequestImages().stream()
                        .map(RequestImage::getImageUrl)
                        .collect(Collectors.toList());

        this.estimates = (entity.getEstimates() == null) ? Collections.emptyList() :
                entity.getEstimates().stream()
                        .map(EstimateResDTO::from)
                        .collect(Collectors.toList());
    }

    /**
     * 외부에서 DTO를 생성할 때 사용하는 정적 팩토리 메소드
     */
    public static QuoteRequestResDTO from(QuoteRequest entity, int estimateCount) {
        return new QuoteRequestResDTO(entity, estimateCount);
    }
}