package com.spring.carparter.service;

import com.spring.carparter.dto.QuoteRequestReqDTO;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import com.spring.carparter.repository.QuoteRequestRepository;
import com.spring.carparter.repository.UserCarRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuoteRequestService {
    private final QuoteRequestRepository quoteRequestRepository;
    private final UserRepository userRepository;
    private final UserCarRepository userCarRepository;

    public void createAndSaveQuoteRequest(QuoteRequestReqDTO request) {
        // 1. 사용자 엔티티를 찾습니다.
        User user = userRepository.findByUserId(request.getUserId());
        if (user == null) {
            throw new IllegalArgumentException("User not found with userId: " + request.getUserId());
        }

        // 2. 차량 엔티티를 찾습니다.
        // UserCarRepository는 Long 타입을 ID로 사용하므로 Long으로 변환합니다.
        UserCar userCar = userCarRepository.findById(request.getUserCarId())
                .orElseThrow(() -> new IllegalArgumentException("UserCar not found with id: " + request.getUserCarId()));

        // 3. QuoteRequest 엔티티를 빌더 패턴으로 생성합니다.
        QuoteRequest quoteRequest = request.toEntity(request,user,userCar);

        // 4. 생성된 엔티티를 저장합니다.
        quoteRequestRepository.save(quoteRequest);
    }

    public void deleteQuoteRequest(Long quoteRequestId){
        quoteRequestRepository.deleteById(quoteRequestId.intValue());
    }

    public QuoteRequest getQuoteRequest(Long quoteRequestId){
        return quoteRequestRepository.findById(quoteRequestId.intValue()).orElseThrow();
    }

    // 한 user의 견적요청서를 가져오는 함수
    public QuoteRequest getQuoteRequestByRequestId(User user){
        return quoteRequestRepository.findByUser_UserId(user.getUserId()).orElseThrow();
    }
}
