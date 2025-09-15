package com.spring.carparter.service;

import com.spring.carparter.dto.UserReqDTO;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User registerUser(UserReqDTO userReqDTO) {
        User user = userReqDTO.toEntity(userReqDTO);
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        userRepository.deleteByUserId(userId);
    }

    public User updateUser(String password, UserReqDTO userReqDTO) {
        userReqDTO.setPassword(password);
        User user = userReqDTO.toEntity(userReqDTO);
        userRepository.save(user);
        return user;
    }

    public User getUser(String userId) {
        User user;
        try {
            user = userRepository.findByUserId(userId);

            return user;
        } catch (Exception e) {
            System.out.println("User not found"+e);
            return null;
        }
    }
    public Boolean isCorrectPhone(String phone){

        // 인증번호 8자리를 만들어요.

        // 인증번호를 핸드폰 문자로 보내요

        // 인증번호 보낸 것과 일치하는지 확인해요

        // 인증한다면

        return true;
    }

}
