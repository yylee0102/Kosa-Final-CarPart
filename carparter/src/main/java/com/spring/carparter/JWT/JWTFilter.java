package com.spring.carparter.JWT;

import com.spring.carparter.security.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j; // Slf4j 임포트 추가
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j // 로그 사용을 위해 @Slf4j 어노테이션 추가
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // ▼▼▼▼▼ [수정된 부분 시작] ▼▼▼▼▼
        String token = null;

        // 1. 헤더에서 'Authorization' 토큰을 먼저 찾습니다.
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        // 2. [추가된 로직] 헤더에 토큰이 없고, 요청이 SSE 구독일 경우 URL 파라미터에서 토큰을 찾습니다.
        else if (request.getRequestURI().equals("/api/notifications/subscribe") && request.getParameter("token") != null) {
            token = request.getParameter("token");
            log.info("SSE 연결 요청: URL 파라미터에서 토큰을 사용합니다.");
        }

        // 토큰이 없으면 다음 필터로 넘깁니다.
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }
        // ▲▲▲▲▲ [수정된 부분 끝] ▲▲▲▲▲

        // 토큰 만료 여부 확인
        if (jwtUtil.isExpired(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰에서 정보 추출 후 인증 처리 (기존 로직과 동일)
        String userId = jwtUtil.getUserId(token);
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        String userType = jwtUtil.getUserType(token);

        CustomUserDetails customUserDetails = new CustomUserDetails(userId, null, username, role, userType);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}