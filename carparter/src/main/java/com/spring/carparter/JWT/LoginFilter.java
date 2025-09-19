package com.spring.carparter.JWT;

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
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = obtainUsername(request);
        String password = obtainPassword(request);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        log.info("로그인 성공 ......");
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
        log.info("로그인 실패 ... ......");
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(401);

        Map<String, Object> map = new HashMap<>();
        map.put("error", "ID 또는 비밀번호를 다시 확인해주세요.");
        Gson gson = new Gson();
        String result = gson.toJson(map);
        response.getWriter().print(result);
    }
}