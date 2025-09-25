package com.spring.carparter.config;

import com.spring.carparter.JWT.JWTFilter;
import com.spring.carparter.JWT.JWTUtil;
import com.spring.carparter.JWT.LoginFilter;
import com.spring.carparter.entity.Admin;
import com.spring.carparter.repository.AdminRepository;
import com.spring.carparter.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Spring의 설정 클래스임을 나타냅니다.
@Configuration
// Spring Security 설정을 활성화합니다.
@EnableWebSecurity
// final 필드에 대한 생성자를 자동으로 만들어줍니다 (의존성 주입).
@RequiredArgsConstructor
public class SecurityConfig {

    // JWT 관련 유틸리티 클래스 (생성, 검증 등)
    private final JWTUtil jwtUtil;
    // 사용자 정보를 DB에서 조회하는 서비스
    private final CustomUserDetailsService customUserDetailsService;
    // Spring Security의 인증 설정을 관리하는 객체
    private final AuthenticationConfiguration authenticationConfiguration;

    /**
     * 🔑 비밀번호 암호화를 위한 BCryptPasswordEncoder를 Bean으로 등록합니다.
     * 회원가입 시나 비밀번호 변경 시 이 인코더를 사용하여 비밀번호를 해시(hash)합니다.
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * ⚙️ Spring Security의 인증을 총괄하는 AuthenticationManager를 Bean으로 등록합니다.
     * LoginFilter에서 사용자의 인증을 시도할 때 이 객체를 사용합니다.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * HttpSecurity를 설정하여 전체적인 보안 메커니즘을 구성하는 가장 핵심적인 부분입니다.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 위에서 Bean으로 등록한 AuthenticationManager를 가져옵니다.
        AuthenticationManager authenticationManager = authenticationManager(authenticationConfiguration);

        // --- LoginFilter 설정 ---
        // 1. 로그인 처리를 담당하는 LoginFilter 객체를 생성합니다.
        LoginFilter loginFilter = new LoginFilter(authenticationManager, jwtUtil);
        // 2. 이 필터가 반응할 로그인 요청 URL을 '/api/login'으로 명시적으로 설정합니다.
        loginFilter.setFilterProcessesUrl("/api/login");


        // --- HttpSecurity 상세 설정 ---
        http
                // csrf(Cross-Site Request Forgery) 보호 기능을 비활성화합니다.
                // JWT 같은 토큰 기반 인증에서는 세션을 사용하지 않으므로 일반적으로 비활성화합니다.
                .csrf((csrf) -> csrf.disable())

                // Spring Security가 기본으로 제공하는 form 기반 로그인 기능을 비활성화합니다.
                // 커스텀 필터인 LoginFilter를 사용할 것이기 때문입니다.
                .formLogin((formLogin) -> formLogin.disable())

                // HTTP Basic 인증 방식을 비활성화합니다.
                // 요청 헤더에 아이디와 비밀번호를 직접 담아 보내는 방식이며, 토큰 인증에서는 불필요합니다.
                .httpBasic((httpBasic) -> httpBasic.disable())

                // 🔗 세션 관리 설정을 'STATELESS'로 지정합니다.
                // 서버가 클라이언트의 상태를 저장하지 않는 '무상태'로 운영하며, 오직 JWT 토큰으로만 인증을 처리합니다.
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 🚪 경로별 접근 권한을 설정합니다.
                .authorizeHttpRequests((auth) -> auth
                        // 현재는 개발 편의를 위해 모든 요청('anyRequest')을 허용('permitAll')합니다.
                        .anyRequest().permitAll())

                // --- 커스텀 필터 등록 ---
                // 1. 로그인 필터(LoginFilter)를 등록합니다.
                //    기존의 UsernamePasswordAuthenticationFilter 위치에 우리의 커스텀 필터를 끼워넣습니다.
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
                // 2. JWT 검증 필터(JWTFilter)를 등록합니다.
                //    LoginFilter 이전에 이 필터를 위치시켜서, 로그인 외의 모든 요청에 대해 JWT 토큰을 검사하도록 합니다.
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        /*
        // --- 실제 배포 시 사용할 보안 설정 예시 ---
        .authorizeHttpRequests((auth) -> auth
            // '/api/login', '/api/users/join' 등 지정된 경로는 인증 없이 누구나 접근 가능
            .requestMatchers("/api/login", "/api/users/join", "/api/car-centers/register").permitAll()
            // '/admin/**' 경로의 모든 요청은 'ADMIN' 역할을 가진 사용자만 접근 가능
            .requestMatchers("/admin/**").hasRole("ADMIN")
            // 위에서 지정한 경로 외의 모든 요청은 반드시 인증을 거쳐야 함
            .anyRequest().authenticated());
        */

        return http.build();
    }


    /**
     * 애플리케이션 시작 시 관리자 계정을 생성하는 CommandLineRunner Bean
     */
    @Bean
    public CommandLineRunner initAdminData(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // "admin01" 이라는 아이디의 관리자가 없는 경우에만 생성
            if (!adminRepository.existsById("admin01")) {
                Admin admin = Admin.builder()
                        .adminId("admin01")
                        .name("총관리자")
                        .password(passwordEncoder.encode("adminpass")) // 비밀번호 암호화
                        .build();
                adminRepository.save(admin);
                System.out.println("====== SecurityConfig: 총관리자(admin01) 계정이 생성되었습니다. ======");
            }
        };
    }
}