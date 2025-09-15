package com.spring.carparter.dto;

import com.spring.carparter.entity.UsedPart;
import lombok.*;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsedPartReqDTO {

    private String partName; // 부품 이름
    private String description; //부품 상세 설명
    private Integer price; // 판매 가격
    private String category; //부품 카테고리
    private String compatibleCarModel;//부품이 호환되는 차량 모델 명

    //Entity호 변환

    public UsedPart toEntity(){
        return UsedPart.builder()
                .partName(this.partName)
                .description(this.description)
                .price(this.price)
                .category(this.category)
                .compatibleCarModel(this.compatibleCarModel)
                .build();
    }


}
