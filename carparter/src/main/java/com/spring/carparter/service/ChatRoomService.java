// 파일 경로: com/spring/carparter/service/ChatRoomService.java

package com.spring.carparter.service;

import com.spring.carparter.dto.ChatRoomResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.ChatRoom;
import com.spring.carparter.entity.User;
import com.spring.carparter.exception.ResourceNotFoundException;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ChatRoomRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final UserRepository userRepository;
    private final CarCenterRepository carCenterRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Transactional
    public ChatRoom findOrCreateRoom(String userId, String centerId) {
        return chatRoomRepository.findByUser_UserIdAndCarCenter_CenterId(userId, centerId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("요청한 사용자를 찾을 수 없습니다: " + userId));

                    CarCenter carCenter = carCenterRepository.findById(centerId)
                            .orElseThrow(() -> new ResourceNotFoundException("요청한 카센터를 찾을 수 없습니다: " + centerId));

                    ChatRoom newChatRoom = ChatRoom.builder()
                            .user(user)
                            .carCenter(carCenter)
                            .build();
                    return chatRoomRepository.save(newChatRoom);
                });
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResDTO> getRoomsForUser(String userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findAllByUser_UserId(userId);
        return chatRooms.stream().map(ChatRoomResDTO::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResDTO> getRoomsForCenter(String centerId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findAllByCarCenter_CenterId(centerId);
        return chatRooms.stream()
                .map(ChatRoomResDTO::from)
                .collect(Collectors.toList());
    }



}