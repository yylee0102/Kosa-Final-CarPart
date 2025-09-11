package com.spring.carparter.repository;

import com.spring.carparter.entity.UserCar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCarRepository extends JpaRepository<UserCar, Long> {
}
