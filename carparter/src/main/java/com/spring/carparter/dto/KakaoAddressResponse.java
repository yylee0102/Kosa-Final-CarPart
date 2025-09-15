package com.spring.carparter.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * 카카오 주소 검색 API의 응답 전체를 담는 DTO
 */
@Getter
@NoArgsConstructor
public class KakaoAddressResponse {

    @JsonProperty("documents")
    private List<Document> documents;

    @Getter
    @NoArgsConstructor
    public static class Document {
        @JsonProperty("x")
        private String longitude; // 경도

        @JsonProperty("y")
        private String latitude;  // 위도
    }
}