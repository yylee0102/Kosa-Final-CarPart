package com.spring.carparter.service;

import java.util.List;
import java.util.Optional;

import jakarta.transaction.Transactional;
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


    @Transactional
    public CsInquiry makeCsInquiry(CsInquiryReqDTO request,String userId) {
        CsInquiry cs = request.toEntity(request, userRepository.findByUserId(userId));
        User user = userRepository.findByUserId(userId);
        csInquiryRepository.save(cs);
        return cs;

    }

    public CsInquiryResDTO getCsInquiry(Integer inquiryId){
    // PK 타입이 Integer이므로 파라미터 타입을 맞추는 것이 좋습니다.
    CsInquiry csInquiry = csInquiryRepository.findById(inquiryId).orElseThrow();
    return new CsInquiryResDTO(csInquiry); // new 키워드로 생성자 호출
    }

    public List<CsInquiryResDTO> getAllInquiries() {
        List<CsInquiry> inquiries = csInquiryRepository.findAll();
        List<CsInquiryResDTO> dtoList = inquiries.stream()
                .map(CsInquiryResDTO::new) // CsInquiryResDTO의 생성자를 참조
                .toList();

        return dtoList;
    }

    public List<CsInquiryResDTO> getAllQandA() {
        List<CsInquiry> list = csInquiryRepository.findByAnswerContentIsNotNull();
        List<CsInquiryResDTO> dtoList = list.stream()
                .map(CsInquiryResDTO::new) // CsInquiryResDTO의 생성자를 참조
                .toList();
        return dtoList;
    }

    @Transactional
    public void deleteCsInquiry(Integer inquiryId) {
        csInquiryRepository.deleteById(inquiryId);
    }

    @Transactional
    public CsInquiryResDTO updateCsInquiry(Integer inquiryId, CsInquiryReqDTO request, String userId) {
        // 1. 기존 문의 찾기
        CsInquiry csInquiry = csInquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));

        // 2. 소유권 확인
        if (!csInquiry.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("이 문의를 수정할 권한이 없습니다.");
        }

        // 3. 답변 여부 확인
        if (csInquiry.getAnswerContent() != null) {
            throw new RuntimeException("이미 답변이 완료된 문의는 수정할 수 없습니다.");
        }

        // 4. 엔티티 업데이트
        //    CsInquiryReqDTO의 필드를 사용하여 엔티티의 제목과 내용을 업데이트합니다.
        csInquiry.setTitle(request.getTitle());
        csInquiry.setQuestionContent(request.getQuestionContent());

        // 5. 업데이트된 엔티티 저장
        CsInquiry updatedInquiry = csInquiryRepository.save(csInquiry);

        // 6. 결과 DTO로 변환하여 반환
        return new CsInquiryResDTO(updatedInquiry);
    }
}
