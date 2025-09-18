package com.spring.carparter.service;

import com.spring.carparter.dto.UserReqDTO;
import com.spring.carparter.dto.UserResDTO;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResDTO registerUser(UserReqDTO userReqDTO) {
        User user = userReqDTO.toEntity(userReqDTO);
        userRepository.save(user);
        return UserResDTO.from(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteByUserId(userId);
    }

    public UserResDTO updateUser(String userId, UserReqDTO request) {
        // 1. 기존 사용자 정보를 DB에서 조회합니다.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 2. DTO에 담긴 정보로 엔티티의 값을 업데이트합니다.
        //    (이 부분의 로직이 누락되었을 가능성이 높습니다)
        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getPassword() != null)
            user.setPassword(request.getPassword());

        return UserResDTO.from(user);
    }

    // req에는 ID가 있다.
    @Transactional
    public void resetPassword(UserReqDTO req,String password) {
        User user = userRepository.findByUserId(req.getUserId());
        user.setPassword(password);
        userRepository.save(user);
    }


    // req에는 이름과 핸드폰 번호가 들어있다.
    public Boolean isCorrectPhone(UserReqDTO req){

        // 인증번호 8자리를 만들어요.

        // 인증번호를 핸드폰 문자로 보내요

        // 인증번호 보낸 것과 일치하는지 확인해요

        // 인증한다면

        return true;
    }

}
