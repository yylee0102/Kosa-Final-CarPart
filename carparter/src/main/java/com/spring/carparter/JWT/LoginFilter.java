package com.spring.carparter.JWT;

import com.fasterxml.jackson.databind.ObjectMapper; // 👈 Jackson ObjectMapper 임포트
import com.google.gson.Gson;
import com.spring.carparter.security.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
// 💡 @RequiredArgsConstructor는 final 필드에 대한 생성자를 만들므로, 직접 생성자를 만들 경우 제거해도 됩니다.
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    // 💡 생성자를 명확하게 정의합니다.
    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 🔄 [수정된 부분] 인증을 시도하는 핵심 메소드
     * 기존의 폼 데이터 방식 대신, Request Body의 JSON을 직접 읽어 처리하도록 수정합니다.
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        log.info("===== LoginFilter.attemptAuthentication 실행 =====");

        try {
            // 1. Request Body에서 JSON 데이터를 읽어옵니다.
            String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            log.info("요청받은 JSON Body: " + requestBody);

            // 2. Jackson ObjectMapper를 사용하여 JSON을 Map 형태로 변환합니다.
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> loginData = objectMapper.readValue(requestBody, Map.class);

            // 3. Map에서 username과 password를 추출합니다.
            String username = loginData.get("username");
            String password = loginData.get("password");

            log.info("추출된 username: " + username);

            // 4. 추출한 정보로 인증 토큰을 생성합니다.
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

            // 5. AuthenticationManager에 인증을 위임합니다.
            return authenticationManager.authenticate(authToken);

        } catch (IOException e) {
            log.error("JSON 파싱 중 에러 발생", e);
            throw new RuntimeException("로그인 데이터 처리 중 오류가 발생했습니다.", e);
        }
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        log.info("로그인 성공!");
        response.setContentType("application/json;charset=UTF-8");

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.createJwt(customUserDetails, 1000L * 60 * 60 * 4); // 4시간
        response.addHeader("Authorization", "Bearer " + token);

        Map<String, Object> map = new HashMap<>();
        map.put("userId", customUserDetails.getUserId());
        map.put("name", customUserDetails.getName());
        map.put("role", customUserDetails.getRole());
        map.put("userType", customUserDetails.getUserType());

        Gson gson = new Gson();
        String result = gson.toJson(map);
        response.getWriter().print(result);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        log.error("로그인 실패: " + failed.getMessage());
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(401); // 401 Unauthorized 상태 코드 반환

        Map<String, Object> map = new HashMap<>();
        map.put("error", "ID 또는 비밀번호를 다시 확인해주세요.");
        Gson gson = new Gson();
        String result = gson.toJson(map);
        response.getWriter().print(result);
    }
}