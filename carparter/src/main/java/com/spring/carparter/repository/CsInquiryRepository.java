package com.spring.carparter.repository;

import com.spring.carparter.entity.CsInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 고객센터 1:1 문의(CsInquiry) 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 */
@Repository
public interface CsInquiryRepository extends JpaRepository<CsInquiry, Integer> {

    /** [나의 문의 내역용] */
    List<CsInquiry> findAllByUserUserIdOrderByCreatedAtDesc(String userId);

    /** [공개 게시판용 - 최신순 정렬] */
    List<CsInquiry> findByAnswerContentIsNotNullOrderByCreatedAtDesc();

    /**
     * [공개 게시판용 - 조회수순 정렬 제거 또는 주석 처리]
     * → viewCount 필드가 없으므로 삭제/주석 처리
     */
    // List<CsInquiry> findByAnswerContentIsNotNullOrderByViewCountDesc();

    /** [관리자용 - 답변 미완료 오래된 순] */
    List<CsInquiry> findByAnswerContentIsNullOrderByCreatedAtAsc();
}
