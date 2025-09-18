package com.spring.carparter.JWT;

import com.spring.carparter.security.CustomUserDetails;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

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
}