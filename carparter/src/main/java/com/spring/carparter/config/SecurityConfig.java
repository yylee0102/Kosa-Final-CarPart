package com.spring.carparter.config;

import com.spring.carparter.JWT.JWTFilter;
import com.spring.carparter.JWT.JWTUtil;
import com.spring.carparter.JWT.LoginFilter;
import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.UserCarReqDTO;
import com.spring.carparter.dto.UserReqDTO;
import com.spring.carparter.entity.Admin;
import com.spring.carparter.repository.AdminRepository;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.UserRepository;
import com.spring.carparter.security.CustomUserDetailsService;
import com.spring.carparter.service.CarCenterService;
import com.spring.carparter.service.UserService;
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

import java.util.Random;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final AuthenticationConfiguration authenticationConfiguration;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationManager authenticationManager = authenticationManager(authenticationConfiguration);

        LoginFilter loginFilter = new LoginFilter(authenticationManager, jwtUtil);
        loginFilter.setFilterProcessesUrl("/api/login");

        http
                .csrf((csrf) -> csrf.disable())
                .formLogin((formLogin) -> formLogin.disable())
                .httpBasic((httpBasic) -> httpBasic.disable())
                .sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/notifications/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        return http.build();
    }

    /**
     * 애플리케이션 시작 시 서비스 계층을 통해 테스트용 더미 데이터를 생성합니다.
     * (최신 DTO 구조 반영)
     */
    @Bean
    public CommandLineRunner initData(
            AdminRepository adminRepository,
            UserRepository userRepository,
            CarCenterRepository carCenterRepository,
            UserService userService,
            CarCenterService carCenterService,
            PasswordEncoder passwordEncoder //
    ) {
        return args -> {
            // --- 총관리자(Admin) 생성 ---
            if (!adminRepository.existsById("admin01")) {
                Admin admin = Admin.builder()
                        .adminId("admin01")
                        .name("총관리자")
                        .password(passwordEncoder.encode("adminpass"))
                        .build();
                adminRepository.save(admin);
                System.out.println("====== SecurityConfig: 총관리자(admin01) 계정이 생성되었습니다. ======");
            }

            // ====== 고객 40명 및 차량 생성 ======
            if (userRepository.count() < 40) {
                Random rnd = new Random(20251004L);
                String[] carModels = { "현대 쏘나타", "기아 K5", "현대 아반떼", "기아 스포티지", "현대 투싼", "르노 QM6", "쉐보레 트레일블레이저", "제네시스 G70", "제네시스 G80", "현대 코나" };

                for (int i = 1; i <= 40; i++) {
                    String uid = String.format("user%03d", i);
                    if (!userRepository.existsById(uid)) {
                        // UserReqDTO를 사용하여 사용자 정보 설정
                        UserReqDTO userDto = new UserReqDTO(
                                uid,
                                "user" + (1000 + i), // 비밀번호는 서비스에서 암호화됨
                                "고객" + String.format("%03d", i),
                                "010-" + String.format("%04d", 1000 + rnd.nextInt(9000)) + "-" + String.format("%04d", 1000 + rnd.nextInt(9000)),
                                String.format("9%d0%d%02d-%d%06d", rnd.nextInt(10), 1 + rnd.nextInt(12), 1 + rnd.nextInt(28), 1 + rnd.nextInt(2), rnd.nextInt(1000000)),
                                rnd.nextBoolean()
                        );
                        userService.registerUser(userDto);

                        // UserCarReqDTO를 사용하여 차량 정보 설정
//                        UserCarReqDTO carDto = new UserCarReqDTO();
//                        carDto.setCarModel(carModels[rnd.nextInt(carModels.length)]);
//                        carDto.setCarNumber(String.format("%02d%s %04d", 10 + rnd.nextInt(80), (char) ('가' + rnd.nextInt(14)), 1000 + rnd.nextInt(9000)));
//                        carDto.setModelYear(2015 + rnd.nextInt(11));
//
//                        userService.createCar(carDto, uid);
                    }
                }
                System.out.println("====== SecurityConfig: 고객 및 차량 더미 데이터 40건이 생성되었습니다. ======");
            }


            // ====== 카센터 50개 생성 ======
            if (carCenterRepository.count() < 50) {
                Random rnd = new Random(20251005L);

                // 👇 기존 citySamples 대신 실제 서울시 주소 목록으로 교체
                String[] realAddressesInSeoul = {
                        "서울시 강남구 테헤란로 152", "서울시 강남구 강남대로 396", "서울시 강남구 도산대로 427",
                        "서울시 서초구 서초대로74길 11", "서울시 서초구 신반포로 176", "서울시 서초구 방배로 180",
                        "서울시 송파구 올림픽로 300", "서울시 송파구 잠실로 209", "서울시 송파구 백제고분로 435",
                        "서울시 금천구 가산디지털1로 168", "서울시 금천구 시흥대로 287", "서울시 금천구 벚꽃로 278",
                        "서울시 마포구 월드컵로 212", "서울시 마포구 양화로 156", "서울시 마포구 독막로 67",
                        "서울시 용산구 이태원로 55", "서울시 용산구 한강대로23길 55", "서울시 용산구 서빙고로 17"
                };

                for (int i = 1; i <= 50; i++) {
                    String cid = String.format("center%03d", i);
                    if (!carCenterRepository.existsById(cid)) {

                        // 👇 주소 생성 로직을 실제 주소 목록에서 랜덤하게 선택하도록 변경
                        String address = realAddressesInSeoul[rnd.nextInt(realAddressesInSeoul.length)];

                        CarCenterReqDTO centerDto = new CarCenterReqDTO(
                                cid,
                                "center" + (1000 + i),
                                "테스트 카센터 " + String.format("%03d", i),
                                address, // 👈 실제 주소 사용
                                String.format("02-%04d-%04d", 1000 + rnd.nextInt(9000), 1000 + rnd.nextInt(9000)),
                                String.format("%03d-%02d-%05d", 100 + rnd.nextInt(900), 10 + rnd.nextInt(90), 10000 + rnd.nextInt(90000)),
                                "09:00 - 18:00",
                                "대량 테스트용 카센터 더미 데이터입니다."
                        );

                        carCenterService.register(centerDto);
                    }
                }
                System.out.println("====== SecurityConfig: 카센터 더미 데이터 50건이 생성되었습니다. ======");
            }
        };
    }
}