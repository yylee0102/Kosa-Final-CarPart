package com.spring.carparter.service;

import com.spring.carparter.dto.UserCarReqDTO;
import com.spring.carparter.dto.UserCarResDTO;
import com.spring.carparter.dto.UserReqDTO;
import com.spring.carparter.dto.UserResDTO;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import com.spring.carparter.repository.UserCarRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserCarRepository userCarRepository;


    /**
     * 신규 사용자를 등록하는 메서드입니다.
     * 아이디 중복 확인 후 비밀번호를 암호화하여 저장합니다.
     *
     * @param userReqDTO 회원가입에 필요한 정보 (userId, password, name 등)
     * @return 생성된 사용자 정보를 담은 UserResDTO
     * @throws RuntimeException 이미 존재하는 아이디일 경우 발생
     */
    public UserResDTO registerUser(UserReqDTO userReqDTO) {
        // 1. 아이디 중복 확인
        if (userRepository.existsById(userReqDTO.getUserId())) {
            // 실제 서비스에서는 좀 더 구체적인 Custom Exception을 사용하는 것이 좋습니다.
            throw new RuntimeException("이미 사용 중인 아이디입니다: " + userReqDTO.getUserId());
        }

        // 2. 비밀번호 암호화
        // SecurityConfig에 있는 BCryptPasswordEncoder를 사용하여 암호화합니다.
        String encodedPassword = passwordEncoder.encode(userReqDTO.getPassword());

        // 3. DTO를 User 엔티티로 변환
        User user = User.builder()
                .userId(userReqDTO.getUserId())
                .password(encodedPassword) // 암호화된 비밀번호를 설정
                .name(userReqDTO.getName())
                .phoneNumber(userReqDTO.getPhoneNumber())
                .ssn(userReqDTO.getSsn())
                .marketingAgreed(userReqDTO.isMarketingAgreed())
                .build();

        // 4. UserRepository를 통해 DB에 저장
        User savedUser = userRepository.save(user);

        // 5. 저장된 User 엔티티를 UserResDTO로 변환하여 반환
        return UserResDTO.from(savedUser);
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

    public UserResDTO getUser(String userId){
        User us = userRepository.findByUserId(userId);
        return UserResDTO.from(us);
    }


    // req에는 이름과 핸드폰 번호가 들어있다.
    public Boolean isCorrectPhone(UserReqDTO req){

        // 인증번호 8자리를 만들어요.

        // 인증번호를 핸드폰 문자로 보내요

        // 인증번호 보낸 것과 일치하는지 확인해요

        // 인증한다면

        return true;
    }

    public UserCarResDTO createCar(UserCarReqDTO req, String userId){
        User user = userRepository.findByUserId(userId);
        UserCar userCar = req.toEntity(user);
        userCarRepository.save(userCar);

        return UserCarResDTO.from(userCar);
    }

    @Transactional // 데이터 변경이 일어나므로 트랜잭션 처리를 해줍니다.
    public UserCarResDTO updateCar(Long carId, String userId, UserCarReqDTO reqDTO) {
        // 1. 수정할 차량을 DB에서 조회합니다.
        UserCar userCar = userCarRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("차량을 찾을 수 없습니다. ID: " + carId));

        // 2. 요청을 보낸 사용자가 차량의 소유주가 맞는지 확인합니다. (보안 강화)
        if (!userCar.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("차량 정보를 수정할 권한이 없습니다.");
        }

        // 3. DTO에 담긴 정보로 기존 Entity의 값을 업데이트합니다.
        //    JPA의 '더티 체킹(Dirty Checking)' 기능 덕분에 save를 호출하지 않아도
        //    트랜잭션이 끝날 때 변경사항이 자동으로 DB에 반영됩니다.
        userCar.setCarModel(reqDTO.getCarModel());
        userCar.setCarNumber(reqDTO.getCarNumber());
        userCar.setModelYear(reqDTO.getModelYear());

        // 4. 업데이트된 Entity를 응답 DTO(ResDTO)로 변환하여 반환합니다.
        return UserCarResDTO.from(userCar);
    }

    public List<UserCarResDTO> getMyCars(String userId){
        List<UserCar> list = userCarRepository.findAllByUser_UserId(userId);

        return list.stream()
                .map(UserCarResDTO::from)
                .collect(Collectors.toList());
    }




}
