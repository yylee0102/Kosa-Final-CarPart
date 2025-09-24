package com.spring.carparter.security;

import com.spring.carparter.entity.Admin;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.AdminRepository;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CarCenterRepository carCenterRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("\n===== [시작] CustomUserDetailsService.loadUserByUsername =====");
        System.out.println("요청받은 아이디: " + username);

        // --- 1. Repository Null 체크 ---
        if (userRepository == null || carCenterRepository == null || adminRepository == null) {
            System.out.println("❌ [오류] Repository 중 하나가 null입니다!");
            System.out.println("UserRepository is null: " + (userRepository == null));
            System.out.println("CarCenterRepository is null: " + (carCenterRepository == null));
            System.out.println("AdminRepository is null: " + (adminRepository == null));
            System.out.println("===== [종료] CustomUserDetailsService =====");
            throw new IllegalStateException("필수 Repository가 주입되지 않았습니다.");
        }
        System.out.println("✅ [확인] 모든 Repository가 정상적으로 주입되었습니다.");

        // --- 2. 일반 사용자(User) 테이블에서 조회 ---
        System.out.println("🔍 1단계: User 테이블에서 '" + username + "' 조회 시도...");
        Optional<User> userOptional = userRepository.findById(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("✅ [성공] User 테이블에서 사용자를 찾았습니다: " + user.getName());
            System.out.println("===== [종료] CustomUserDetailsService =====");
            return new CustomUserDetails(user.getUserId(), user.getPassword(), user.getName(), "ROLE_USER", "USER");
        }
        System.out.println("... User 테이블에 해당 아이디 없음.");


        // --- 3. 카센터(CarCenter) 테이블에서 조회 ---
        System.out.println("🔍 2단계: CarCenter 테이블에서 '" + username + "' 조회 시도...");
        Optional<CarCenter> carCenterOptional = carCenterRepository.findById(username);
        if (carCenterOptional.isPresent()) {
            CarCenter carCenter = carCenterOptional.get();
            System.out.println("✅ [성공] CarCenter 테이블에서 사용자를 찾았습니다: " + carCenter.getCenterName());
            System.out.println("===== [종료] CustomUserDetailsService =====");
            return new CustomUserDetails(carCenter.getCenterId(), carCenter.getPassword(), carCenter.getCenterName(), "ROLE_CAR_CENTER", "CAR_CENTER");
        }
        System.out.println("... CarCenter 테이블에 해당 아이디 없음.");


        // --- 4. 관리자(Admin) 테이블에서 조회 ---
        System.out.println("🔍 3단계: Admin 테이블에서 '" + username + "' 조회 시도...");
        Optional<Admin> adminOptional = adminRepository.findById(username);
        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            System.out.println("✅ [성공] Admin 테이블에서 사용자를 찾았습니다: " + admin.getName());
            System.out.println("===== [종료] CustomUserDetailsService =====");
            return new CustomUserDetails(admin.getAdminId(), admin.getPassword(), admin.getName(), "ROLE_ADMIN", "ADMIN");
        }
        System.out.println("... Admin 테이블에 해당 아이디 없음.");


        // --- 5. 모든 테이블에서 사용자를 찾지 못한 경우 ---
        System.out.println("❌ [실패] 모든 테이블에서 '" + username + "' 사용자를 찾을 수 없습니다.");
        System.out.println("===== [종료] CustomUserDetailsService =====");
        throw new UsernameNotFoundException("User not found: " + username);
    }
}