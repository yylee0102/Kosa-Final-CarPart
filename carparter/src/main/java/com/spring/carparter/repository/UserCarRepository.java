package com.spring.carparter.repository;

import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * UserCar 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 */
@Repository
public interface UserCarRepository extends JpaRepository<UserCar, Long> {

    /**
     * 특정 사용자가 등록한 모든 차량 목록을 조회합니다.
     * '마이페이지 > 내 차고'와 같은 기능에서 사용됩니다.
     *
     * @param userId 사용자의 고유 ID
     * @return 해당 사용자의 차량(UserCar) 리스트
     */
    @EntityGraph(attributePaths = {"user"})
      List<UserCar> findAllByUser_UserId(String userId);
     
}

