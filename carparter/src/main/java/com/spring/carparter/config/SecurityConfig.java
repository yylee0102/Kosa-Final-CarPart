package com.spring.carparter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보호 비활성화 (Stateless한 REST API에서는 보통 비활성화합니다)
                .csrf(csrf -> csrf.disable())

                // 세션을 사용하지 않도록 설정 (JWT 사용을 위함)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // HTTP 요청에 대한 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
//                        // ✅ '/api/car-centers/register' 와 '/api/car-centers/login' 경로는 누구나 접근 허용
//                        .requestMatchers("/api/car-centers/register", "/api/car-centers/login").permitAll()
//
//                        // ✅ 그 외의 모든 요청은 인증된 사용자만 접근 가능
//                        .anyRequest().authenticated()
                                .anyRequest().permitAll()
                );

        return http.build();
    }
}