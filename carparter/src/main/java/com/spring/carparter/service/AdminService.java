package com.spring.carparter.service;

import com.spring.carparter.dto.*;
import com.spring.carparter.entity.*;
import com.spring.carparter.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final CarCenterRepository carCenterRepository;
    private final ReviewReportRepository reviewReportRepository;
    private final CarCenterApprovalRepository carCenterApprovalRepository;
    private final CsInquiryRepository csInquiryRepository;
    private final AnnouncementRepository announcementRepository;



    /**
     * 2. 사용자 남여 분포도
     * */
    public Map<String, Integer> genderCountsMap() {
        List<Object[]> rows = userRepository.countMaleFemaleRaw();
        if (rows.isEmpty()) return Map.of("male", 0, "female", 0);

        Object[] row = rows.get(0); // ✅ 첫 번째 행만 사용
        int male   = row[0] == null ? 0 : ((Number) row[0]).intValue();
        int female = row[1] == null ? 0 : ((Number) row[1]).intValue();
        return Map.of("male", male, "female", female);
    }

    /**
     * 3. 사용자 나이별 분포도
     * */
    public Map<String, Integer> ageBandCounts() {
        List<Object[]> rows = userRepository.ageBandRows();

        // 순서 유지용 LinkedHashMap
        Map<String, Integer> map = new java.util.LinkedHashMap<>();
        for (Object[] r : rows) {
            String label = (String) r[0];
            int cnt = r[1] == null ? 0 : ((Number) r[1]).intValue();
            map.put(label, cnt);
        }

        // 20~50대까지는 항상 키가 존재하도록 0으로 메꿔줌
        for (String k : new String[]{"20s","30s","40s","50s"}) {
            map.putIfAbsent(k, 0);
        }

        return map;
    }

    /**
     * 4. 총 일반 사용자
     * */
    public Long userCount(){
        return userRepository.count();
    }

    /**
     * 5. 총 카센터
     * */
    public Long carCenterCount(){
        return carCenterRepository.count();
    }

    /**
     * 6. 카센터 등록 대기 수
     * */
    public Long pendingApprovalCount(){
        return carCenterApprovalRepository.count();
    }

    /**
     * 7. 신고 된 후기 수
     * */
    public Long reviewReportCount(){
        return reviewReportRepository.count();
    }

    /**
     * 8. 회원가입 승인 대기 중인 카센터
     * */
    public List<CarCenterApprovalResDTO> getPendingApprovals(){
        return carCenterApprovalRepository.findPendingApprovals();
    }

    /**
     * 9. 회원가입 승인 대기 중인 카센터 상세보기
     * */
    public CarCenterApprovalResDTO getCenterApproval(Long approvalId){
        return carCenterApprovalRepository.findApprovalResById(approvalId)
                                        .orElseThrow(() -> new RuntimeException("카센터 대기 상세 보기중 오류"));
    }
    /**
     * 10. 카센터 회원가입 반려
     * */
    @Transactional
    public String removeCenterApproval(Long approvalId, String reason) {
        CarCenterApprovalResDTO centerApprovalResDTO = carCenterApprovalRepository.findApprovalResById(approvalId)
                .orElseThrow(
                        () -> new RuntimeException("찾지 못했습니다.")
                );
        carCenterRepository.deleteById(centerApprovalResDTO.getCenterId());

        return reason;
    }

    /**
     * 11. 카센터 회원가입 승인
     * */

    @Transactional
    public void addCarCenter(Long approvalId) {
        CarCenterApprovalResDTO centerApproval = carCenterApprovalRepository.findApprovalResById(approvalId).
                                orElseThrow(() ->  new RuntimeException(approvalId + "찾지 못하였습니다."));

        CarCenter fCenter = carCenterRepository.findByCenterId(centerApproval.getCenterId())
                .orElseThrow( () -> new RuntimeException(centerApproval.getCenterId() + "찾지 못하였습니다."));

        fCenter.setStatus(CarCenterStatus.ACTIVE);
        carCenterApprovalRepository.deleteById(approvalId);
    }

    /**
     * 12. 문의 리스트
     * */
    public List<CsInquiry> getAllCsInquiry(){
        return csInquiryRepository.findByAnswerContentIsNotNullOrderByCreatedAtDesc();
    }

    /**
     * 12. 문의 상세 보기
     * */
    public CsInquiry getCsInquiry(Integer inquiryId){
        return csInquiryRepository.findById(inquiryId).orElseThrow(
                () -> new RuntimeException(inquiryId + "찾지 못함")
        );
    }

    /**
     * 13. 문의에 대한 답변 / 수정
     * */
    @Transactional
    public void answerInquiry(CsInquiry csInquiry){
        CsInquiry fcsInquiry = csInquiryRepository.findById(csInquiry.getInquiryId()).orElseThrow(
                () -> new RuntimeException(csInquiry + "찾지 못함")
        );
        fcsInquiry.setAnswerContent(csInquiry.getAnswerContent());
        fcsInquiry.setAnsweredAt(LocalDateTime.now());
    }

    /**
     * 14. 공지사항 등록
     * */
    @Transactional
    public void addAnnouncement(Announcement announcement){
        announcementRepository.save(announcement);
    }

    /**
     * 15. 공지사항 삭제
     * */
    @Transactional
    public void removeAnnouncement(Long announcementId){
        announcementRepository.deleteById(announcementId);
    }

    /**
     * 16. 공지사항 수정
     * */
    @Transactional
    public void updateAnnouncement(Announcement announcement){
        Announcement findObject = announcementRepository.findById(announcement.getAnnouncementId().longValue()).orElseThrow(
                () -> new RuntimeException(announcement + "찾지 못함")
        );

        findObject.setTitle(announcement.getTitle());
        findObject.setContent(announcement.getContent());
    }

    /**
     * 17. 공지사항 리스트
     * */
    @Transactional
    public List<Announcement> findAllAnnouncement(){
        return announcementRepository.findAll();
    }

    /**
     * 18. 공지사항 상세 보기
     * */
    @Transactional
    public Announcement findAnnouncement(Integer announcementId){
        return announcementRepository.findById(announcementId.longValue()).orElseThrow(
                () -> new RuntimeException(announcementId + "찾는 중 오류")
        );
    }

    /**
     * 19. 신고된 후기 리스트
     * */
        public List<ReviewReportResDTO> findAllReviewReport(){
        return reviewReportRepository.findAllAsResDTO();
    }

    /**
     * 20. 신고된 후기 상세보기
     * */
    public ReviewReportResDTO findReviewReport(Integer reportId){
        return reviewReportRepository.findResDTOById(reportId).orElseThrow(
                () -> new RuntimeException("찾는중 오류")
        );
    }

    /**
     * 21. 신고된 리뷰 삭제
     * */
    public void deleteReport(Integer reportId){
        reviewReportRepository.deleteById(reportId);
    }
}

