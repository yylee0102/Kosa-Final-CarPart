package com.spring.carparter.service;

import com.spring.carparter.dto.Coordinates;
import com.spring.carparter.dto.KakaoAddressResponse;
import org.slf4j.Logger; // ❗❗ SLF4J Logger 임포트
import org.slf4j.LoggerFactory; // ❗❗ SLF4J LoggerFactory 임포트
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GeocodingService {

    // ✅ 로그 출력을 위한 Logger 객체 생성
    private static final Logger log = LoggerFactory.getLogger(GeocodingService.class);

    private final WebClient webClient;
    private final String kakaoApiKey;
    private final String geocodingUrl;

    public GeocodingService(WebClient.Builder webClientBuilder,
                            @Value("${api.kakao.rest-api-key}") String kakaoApiKey,
                            @Value("${api.kakao.geocoding-url}") String geocodingUrl) {
        this.kakaoApiKey = "KakaoAK " + kakaoApiKey;
        this.geocodingUrl = geocodingUrl;
        this.webClient = webClientBuilder.baseUrl(this.geocodingUrl).build();
    }

    public Mono<Coordinates> getCoordinates(String address) {
        // ✅ 로그 추가 1: 어떤 주소로 API를 호출하는지 기록
        log.info("카카오 주소 변환 API 호출 시작. 주소: '{}'", address);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.queryParam("query", address).build())
                .header(HttpHeaders.AUTHORIZATION, kakaoApiKey)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(KakaoAddressResponse.class)
                .map(response -> {
                    if (response != null && !response.getDocuments().isEmpty()) {
                        KakaoAddressResponse.Document firstDoc = response.getDocuments().get(0);
                        double latitude = Double.parseDouble(firstDoc.getLatitude());
                        double longitude = Double.parseDouble(firstDoc.getLongitude());

                        // ✅ 로그 추가 2: API 호출 성공 및 결과 좌표 기록
                        log.info("주소 변환 성공. 위도: {}, 경도: {}", latitude, longitude);
                        return new Coordinates(latitude, longitude);
                    }
                    // ✅ 로그 추가 3: API는 성공했으나, 검색 결과가 없는 경우
                    log.warn("주소 검색 결과가 없습니다. 주소: '{}'", address);
                    return null;
                })
                .onErrorResume(e -> {
                    // ✅ 로그 추가 4: API 호출 중 네트워크 오류 등 예외가 발생한 경우
                    log.error("카카오 주소 변환 API 호출 중 오류 발생! 주소: '{}', 오류: {}", address, e.getMessage());
                    return Mono.empty(); // 오류 발생 시에는 비어있는 스트림(Mono)을 반환
                });
    }
}