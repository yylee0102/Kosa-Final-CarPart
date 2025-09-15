package com.spring.carparter.service;

import com.spring.carparter.dto.ChatRoomReqDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.ChatRoom;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ChatRoomRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    UserRepository userRepository;
    CarCenterRepository carCenterRepository;
    ChatRoomRepository chatRoomRepository;


    public void makeChatRoom(ChatRoomReqDTO request) {
        User user = userRepository.findByUserId(request.getUserId());
        CarCenter carCenter = carCenterRepository.findById(request.getCarcenterId()).orElseThrow();
        ChatRoom chatRoom = request.toEntity(user, carCenter);

        chatRoomRepository.save(chatRoom);
    }
}
