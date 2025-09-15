package com.spring.carparter.repository;

import com.spring.carparter.entity.UserCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCarRepository extends JpaRepository<UserCar, Integer> {


    // 특정 사용자가 등록한 모든 차량 목록을 조회합니다.
    List<UserCar> findByUser_UserId(String userId);


}