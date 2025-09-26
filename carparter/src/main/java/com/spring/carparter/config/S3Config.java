package com.spring.carparter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3Config {

    // ✅ application.properties에서 access-key와 secret-key 값을 읽어옵니다.
    @Value("${spring.cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${spring.cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Bean
    public S3Presigner s3Presigner() {
        // 1. 읽어온 키 값을 사용하여 AWS 기본 자격 증명(Credentials) 객체를 생성합니다.
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);

        // 2. 위에서 만든 자격 증명 객체를 사용하여 S3Presigner를 구성하고 Bean으로 등록합니다.
        return S3Presigner.builder()
                .region(Region.AP_NORTHEAST_2) // 서울 리전
                // ✅ 자격 증명 공급자를 명시적으로 설정합니다.
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }
}
