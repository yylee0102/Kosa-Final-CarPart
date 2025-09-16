package com.spring.carparter.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.spring.carparter.dto.CsInquiryReqDTO;
import com.spring.carparter.dto.CsInquiryResDTO;
import com.spring.carparter.entity.CsInquiry;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CsInquiryRepository;
import com.spring.carparter.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CsInquiryService {
    private final CsInquiryRepository csInquiryRepository;
    private final UserRepository userRepository;
    
    void makeCsInquiry(CsInquiryReqDTO request,String userId) {
        CsInquiry cs = request.toEntity(request, userRepository.findByUserId(userId));
        User user = userRepository.findByUserId(userId);
        csInquiryRepository.save(cs);

    }

    CsInquiryResDTO getCsInquiry(Integer inquiryId){ 
    // PK 타입이 Integer이므로 파라미터 타입을 맞추는 것이 좋습니다.
    CsInquiry csInquiry = csInquiryRepository.findById(inquiryId).orElseThrow();
    return new CsInquiryResDTO(csInquiry); // new 키워드로 생성자 호출
    }

    List<CsInquiryResDTO> getAllInquiries() {
        List<CsInquiry> inquiries = csInquiryRepository.findAll();
        List<CsInquiryResDTO> dtoList = inquiries.stream()
                .map(CsInquiryResDTO::new) // CsInquiryResDTO의 생성자를 참조
                .toList();

        return dtoList;
    }



}
