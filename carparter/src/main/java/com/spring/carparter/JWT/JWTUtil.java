package com.spring.carparter.JWT;

import com.spring.carparter.security.CustomUserDetails;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class JWTUtil {

    private final SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());


    }

    public String getUserId(String token) { return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userId", String.class); }
    public String getUsername(String token) { return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class); }
    public String getRole(String token) { return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class); }
    public String getUserType(String token) { return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("userType", String.class); }
    public Boolean isExpired(String token) { return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date()); }

    public String createJwt(CustomUserDetails customUserDetails, Long expiredMs) {
        return Jwts.builder()
                .claim("userId", customUserDetails.getUserId())
                .claim("username", customUserDetails.getName())
                .claim("role", customUserDetails.getRole())
                .claim("userType", customUserDetails.getUserType())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }


    /**
     * ✅ [추가] 토큰의 유효성(서명, 만료 시간)을 검증하는 메소드
     * @param token 검증할 JWT 토큰
     * @return 유효하면 true, 아니면 false
     */
    public boolean validateToken(String token) {
        try {
            // 토큰의 만료 시간을 확인합니다. 만료되었으면 false를 반환합니다.
            if (isExpired(token)) {
                return false;
            }
            // Jwts.parser()를 사용하여 토큰을 파싱하고 서명을 검증합니다.
            // 서명이 유효하지 않거나 토큰이 잘못된 형식일 경우 예외가 발생합니다.
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            // 토큰 검증 중 어떤 예외라도 발생하면 유효하지 않은 토큰으로 간주합니다.
            log.error("유효하지 않은 JWT 토큰입니다.", e);
            return false;
        }
    }

    /**
     * ✅ [추가] 유효한 JWT 토큰으로부터 Spring Security의 Authentication 객체를 생성하는 메소드
     * @param token 유효성이 검증된 JWT 토큰
     * @return Authentication 객체
     */
    public Authentication getAuthentication(String token) {
        // 토큰에서 사용자 ID와 역할을 추출합니다.
        String userId = getUserId(token);
        String role = getRole(token);
        String userType = getUserType(token);
        String username = getUsername(token);

        // ✅ [수정] CustomUserDetails 생성자에 'role' 문자열을 직접 전달합니다.
        // 아마도 생성자 형식은 (아이디, 비밀번호, 역할, 이름, 타입)일 것입니다.
        CustomUserDetails principal = new CustomUserDetails(userId, null, role, username, userType);

        // Spring Security의 Authentication 객체를 생성할 때는 여전히 권한 '목록'이 필요합니다.
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

}