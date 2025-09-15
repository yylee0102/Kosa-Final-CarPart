package com.spring.carparter.repository;

import com.spring.carparter.entity.CsInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 고객센터 1:1 문의(CsInquiry) 엔티티에 대한 데이터베이스 접근을 처리하는 Repository 인터페이스입니다.
 * 사용자의 1:1 문의 기능과 답변이 완료된 문의를 보여주는 공개 게시판 기능을 모두 담당합니다.
 */
@Repository
public interface CsInquiryRepository extends JpaRepository<CsInquiry, Integer> {

    /**
     * [나의 문의 내역용]
     * 특정 사용자가 작성한 모든 문의(답변 여부 무관)를 최신순으로 조회합니다.
     * @param userId 사용자의 고유 ID
     * @return 해당 사용자의 문의(CsInquiry) 리스트
     */
    List<CsInquiry> findAllByUserUserIdOrderByCreatedAtDesc(String userId);

    /**
     * [공개 게시판용 - 최신순 정렬]
     * 답변이 완료된 모든 문의를 최신순으로 조회합니다.
     *
     * @return 답변이 완료된 문의(CsInquiry) 리스트
     */
    List<CsInquiry> findByAnswerContentIsNotNullOrderByCreatedAtDesc();

    /**
     * [공개 게시판용 - 조회수순 정렬]
     * 답변이 완료된 모든 문의를 조회수순으로 조회합니다.
     *
     * @return 답변이 완료된 문의(CsInquiry) 리스트
     */
    List<CsInquiry> findByAnswerContentIsNotNullOrderByViewCountDesc();

    /**
     * [관리자용]
     * 아직 답변이 달리지 않은 모든 문의 목록을 오래된 순서대로 조회합니다.
     *
     * @return 답변이 없는 문의(CsInquiry) 리스트
     */
    List<CsInquiry> findByAnswerContentIsNullOrderByCreatedAtAsc();
}