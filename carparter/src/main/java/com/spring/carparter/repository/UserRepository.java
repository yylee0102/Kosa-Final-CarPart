package com.spring.carparter.repository;

import com.spring.carparter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * 전화번호를 기준으로 사용자를 조회합니다.
     * 사용자가 아이디를 잊었을 때 등 본인인증 용도로 활용될 수 있습니다.
     *
     * @param phoneNumber 사용자의 전화번호
     * @return 전화번호와 일치하는 사용자 정보 (Optional)
     */
    Optional<User> findByPhoneNumber(String phoneNumber);

    /**
     * 사용자 아이디(userId)가 이미 존재하는지 확인합니다.
     * 회원가입 시 아이디 중복 검사에 사용됩니다.
     *
     * @param userId 확인할 사용자 아이디
     * @return 아이디 존재 여부 (true/false)
     */
    boolean existsByUserId(String userId);


}
