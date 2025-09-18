package com.spring.carparter.service;

import com.spring.carparter.dto.QuoteRequestReqDTO;
import com.spring.carparter.dto.QuoteRequestResDTO;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.entity.UserCar;
import com.spring.carparter.repository.QuoteRequestRepository;
import com.spring.carparter.repository.UserCarRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuoteRequestService {
    private final QuoteRequestRepository quoteRequestRepository;
    private final UserRepository userRepository;
    private final UserCarRepository userCarRepository;

    public QuoteRequest createAndSaveQuoteRequest(QuoteRequestReqDTO request) {
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
        return quoteRequest;
    }

    public void deleteQuoteRequest(Integer quoteRequestId){
        quoteRequestRepository.deleteById(quoteRequestId);
    }

    public QuoteRequest getQuoteRequest(Integer quoteRequestId){
        return quoteRequestRepository.findById(quoteRequestId).orElseThrow();
    }

    // 한 user의 견적요청서를 가져오는 함수
    public QuoteRequestResDTO getQuoteRequestByUser(User user){
        QuoteRequest quoteRequest =  quoteRequestRepository.findByUser_UserId(user.getUserId()).orElseThrow();
        return QuoteRequestResDTO.from(quoteRequest);
    }

    // 카센터 기준
    // 견적서 진행 중인 견적 요청서가 어떻게 보면 견적 요청서 전체이므로 findAll() 로 하는게 카센터를 위한 것.
    public List<QuoteRequestResDTO> getQuoteRequestsByCenter() {
        List<QuoteRequest> quoteRequests = quoteRequestRepository.findAll();
        return quoteRequests.stream()
                .map(QuoteRequestResDTO::from)
                .collect(Collectors.toList());
    }
}
