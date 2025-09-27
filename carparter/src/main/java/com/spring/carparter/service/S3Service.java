package com.spring.carparter.service;

import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.net.URL;
import java.time.Duration;

/**
 * AWS S3 버킷과의 파일 통신(업로드, 삭제, URL 생성)을 담당하는 서비스
 */
@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    private final S3Presigner s3Presigner;
    private final S3Template s3Template;

    /**
     * 파일을 S3 버킷에 업로드하는 메소드
     *
     * @param file      업로드할 파일 (MultipartFile)
     * @param objectKey S3에 저장될 파일의 이름 (경로 포함, e.g., "used-parts/image.jpg")
     * @return 업로드된 파일의 S3 URL
     * @throws IOException 파일 처리 중 예외 발생 시
     */
    public String uploadFile(MultipartFile file, String objectKey) throws IOException {
        // s3Template.upload(버킷이름, 파일이름, 파일의 InputStream)을 통해 업로드 후 URL 반환
        return s3Template.upload(bucketName, objectKey, file.getInputStream()).getURL().toString();
    }

    /**
     * 파일을 S3 버킷에서 삭제하는 메소드
     *
     * @param fileUrl 삭제할 파일의 전체 URL
     */
    public void deleteFile(String fileUrl) {
        // 전체 URL에서 버킷 이름 뒷부분(객체 키)을 추출합니다.
        // 예: https://carparter.s3.ap-northeast-2.amazonaws.com/used-parts/image.jpg -> used-parts/image.jpg
        String objectKey = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);
        s3Template.deleteObject(bucketName, objectKey);
    }

    /**
     * S3 객체 키(파일 경로)를 사용하여 Pre-signed URL을 생성합니다.
     * Pre-signed URL은 비공개(private) 객체에 대해 제한된 시간 동안 접근 권한을 부여하는 임시 URL입니다.
     *
     * @param objectKey S3 버킷 내의 파일 경로
     * @return 생성된 Pre-signed URL    (내가 추가함)
     */
    public String createPresignedUrl(String objectKey) {
        // URL을 생성할 S3 객체를 특정합니다.
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        // URL의 유효 시간을 설정하여 요청을 생성합니다.
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10)) // URL의 유효 시간 (예: 10분)
                .getObjectRequest(getObjectRequest)
                .build();

        // S3Presigner를 통해 URL을 생성하고 문자열로 반환합니다.
        URL url = s3Presigner.presignGetObject(presignRequest).url();
        return url.toString();
    }
}
