package com.spring.carparter.dto;

import com.spring.carparter.entity.CsInquiry;
import com.spring.carparter.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 1:1 문의 생성을 위한 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
public class CsInquiryReqDTO {

    private String title;
    private String questionContent;

    /**
     * DTO를 CsInquiry 엔티티로 변환하는 메서드
     * @param user 문의를 작성한 사용자 엔티티
     * @return CsInquiry 엔티티
     */
    public CsInquiry toEntity(CsInquiryReqDTO request, User user) {
        return CsInquiry.builder()
                .user(user)
                .title(request.title)
                .questionContent(request.questionContent)
                .build();
    }
}