package com.spring.carparter.repository;

import com.spring.carparter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByPhone(String phone);
    User findByUsername(String username);
    User findByUserId(Long userId);
    User login(String userId, String password);


}
