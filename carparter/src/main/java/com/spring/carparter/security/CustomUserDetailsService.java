package com.spring.carparter.security;

// ... (import 생략)

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
        // 1. 일반 사용자 테이블에서 찾기
        Optional<User> userOptional = userRepository.findById(username);
        if (((Optional<?>) userOptional).isPresent()) {
            User user = userOptional.get();
            return new CustomUserDetails(user.getUserId(), user.getPassword(), user.getName(), "ROLE_USER", "USER");
        }

        // 2. 정비소 테이블에서 찾기
        Optional<CarCenter> carCenterOptional = carCenterRepository.findById(username);
        if (carCenterOptional.isPresent()) {
            CarCenter carCenter = carCenterOptional.get();
            return new CustomUserDetails(carCenter.getCenterId(), carCenter.getPassword(), carCenter.getCenterName(), "ROLE_CAR_CENTER", "CAR_CENTER");
        }

        // 3. 관리자 테이블에서 찾기
        Optional<Admin> adminOptional = adminRepository.findById(username);
        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            return new CustomUserDetails(admin.getAdminId(), admin.getPassword(), admin.getName(), "ROLE_ADMIN", "ADMIN");
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}