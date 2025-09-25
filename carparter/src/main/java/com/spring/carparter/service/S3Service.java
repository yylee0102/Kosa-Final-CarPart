// src/main/java/com/spring/carparter/service/S3Service.java
package com.spring.carparter.service;

import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import io.awspring.cloud.s3.S3Template; // ✅ S3Template 임포트
import org.springframework.web.multipart.MultipartFile; // ✅ MultipartFile 임포트
import java.io.IOException; // ✅ IOException 임포트



import java.net.URL;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    private final S3Presigner s3Presigner;
    private final S3Template s3Template;



    /**
     * ✅ [신규 추가] 파일을 S3 버킷에 업로드하는 메소드
     * @param file 업로드할 파일
     * @param objectKey S3에 저장될 파일의 이름 (경로 포함)
     * @return 업로드된 파일의 S3 URL
     * @throws IOException 파일 처리 중 예외 발생 시
     */
    public String uploadFile(MultipartFile file, String objectKey) throws IOException {
        // s3Template.upload(버킷이름, 파일이름, 파일의 InputStream)
        return s3Template.upload(bucketName, objectKey, file.getInputStream()).getURL().toString();
    }

    /**
     * S3 객체 키(파일 경로)를 사용하여 Pre-signed URL을 생성합니다.
     * @param objectKey S3 버킷 내의 파일 경로
     * @return 생성된 Pre-signed URL
     */
    public String createPresignedUrl(String objectKey) {
        // Presigner를 사용하여 URL 생성 요청을 만듭니다.
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10)) // URL의 유효 시간 (예: 10분)
                .getObjectRequest(getObjectRequest)
                .build();

        // URL 생성 및 반환
        URL url = s3Presigner.presignGetObject(presignRequest).url();
        return url.toString();
    }
}