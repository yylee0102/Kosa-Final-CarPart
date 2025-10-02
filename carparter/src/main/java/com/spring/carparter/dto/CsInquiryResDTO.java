package com.spring.carparter.dto;

import com.spring.carparter.entity.CsInquiry;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

/**
 * 1:1 문의 단일 조회를 위한 응답 DTO
 */
@Getter
public class CsInquiryResDTO {

    private final Integer inquiryId;
    private final String userName; // User 엔티티 전체 대신 사용자의 ID만 노출
    private final String title;
    private final String questionContent;
    private final String answerContent;
    private final LocalDateTime answeredAt;
    private final LocalDateTime createdAt;

    /**
     * CsInquiry 엔티티를 DTO로 변환하는 정적 팩토리 메서드
     * @param entity CsInquiry 엔티티
     */
    public CsInquiryResDTO(CsInquiry entity) {
        this.inquiryId = entity.getInquiryId();
        this.userName = entity.getUser().getName(); // 예시: User 엔티티에 getUserId()가 있다고 가정
        this.title = entity.getTitle();
        this.questionContent = entity.getQuestionContent();
        this.answerContent = entity.getAnswerContent();
        this.answeredAt = entity.getAnsweredAt();
        this.createdAt = entity.getCreatedAt();
    }

}