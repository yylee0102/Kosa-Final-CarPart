package com.spring.carparter.Controller;

import com.spring.carparter.dto.*;
import com.spring.carparter.entity.Announcement;
import com.spring.carparter.entity.CarCenterApproval;
import com.spring.carparter.entity.CsInquiry;
import com.spring.carparter.entity.ReviewReport;
import com.spring.carparter.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * AdminService 기반 관리자용 API 컨트롤러
 *
 * Base Path: /api/admin
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    // 1) 관리자 로그인
    @PostMapping("/login")
    public ResponseEntity<AdminResDTO> login(@RequestBody AdminReqDTO req) {
        AdminResDTO res = adminService.login(req);
        return ResponseEntity.ok(res);
    }

    // 2) 대시보드 - 성별 분포
    @GetMapping("/stats/gender")
    public ResponseEntity<Map<String, Integer>> genderStats() {
        return ResponseEntity.ok(adminService.genderCountsMap());
    }

    // 3) 대시보드 - 연령대 분포
    @GetMapping("/stats/age")
    public ResponseEntity<Map<String, Integer>> ageStats() {
        return ResponseEntity.ok(adminService.ageBandCounts());
    }

    // 4) 대시보드 - 전체 유저 수
    @GetMapping("/stats/users/count")
    public ResponseEntity<Long> userCount() {
        return ResponseEntity.ok(adminService.userCount());
    }

    // 5) 대시보드 - 전체 정비소 수
    @GetMapping("/stats/centers/count")
    public ResponseEntity<Long> centerCount() {
        return ResponseEntity.ok(adminService.carCenterCount());
    }

    // 6) 대시보드 - 대기 승인 건수
    @GetMapping("/stats/approvals/pending/count")
    public ResponseEntity<Long> pendingApprovalCount() {
        return ResponseEntity.ok(adminService.pendingApprovalCount());
    }

    // 7) 대시보드 - 신고된 리뷰 건수
    @GetMapping("/stats/reports/reviews/count")
    public ResponseEntity<Long> reviewReportCount() {
        return ResponseEntity.ok(adminService.reviewReportCount());
    }

    // 8) 정비소 승인 - 대기목록
    @GetMapping("/approvals/pending")
    public ResponseEntity<List<CarCenterApprovalResDTO>> getPendingApprovals() {
        return ResponseEntity.ok(adminService.getPendingApprovals());
    }

    // 9) 정비소 승인 - 단건 조회
    @GetMapping("/approvals/{approvalId}")
    public ResponseEntity<CarCenterApprovalResDTO> getCenterApproval(@PathVariable Long approvalId) {
        return ResponseEntity.ok(adminService.getCenterApproval(approvalId));
    }

    // 10) 정비소 승인 - 반려(사유 포함)
    @DeleteMapping("/approvals/{approvalId}")
    public ResponseEntity<Map<String, String>> removeCenterApproval(@PathVariable Long approvalId,
                                                                    @RequestParam String reason) {
        String msg = adminService.removeCenterApproval(approvalId, reason);
        return ResponseEntity.ok(Map.of("message", msg));
    }

    // 11) 정비소 승인 - 승인 처리(정비소 등록)
    @PostMapping("/approvals/{approvalId}/approve")
    public ResponseEntity<Void> approveCenter(@PathVariable Long approvalId) {
        adminService.addCarCenter(approvalId);
        return ResponseEntity.noContent().build();
    }

    // 12) 1:1 문의 - 전체 목록
    @GetMapping("/cs")
    public ResponseEntity<List<CsInquiry>> getAllCsInquiry() {
        return ResponseEntity.ok(adminService.getAllCsInquiry());
    }

    // 13) 1:1 문의 - 단건 조회
    @GetMapping("/cs/{inquiryId}")
    public ResponseEntity<CsInquiry> getCsInquiry(@PathVariable Integer inquiryId) {
        return ResponseEntity.ok(adminService.getCsInquiry(inquiryId));
    }

    // 14) 1:1 문의 - 답변 등록/수정
    //    서비스 시그니처가 CsInquiry 전체를 받으므로 그대로 Body 매핑합니다.
    @PutMapping("/cs/{inquiryId}/answer")
    public ResponseEntity<Void> answerInquiry(@PathVariable Integer inquiryId,
                                              @RequestBody CsInquiry csInquiry) {
        // 안전하게 ID 동기화
        csInquiry.setInquiryId(inquiryId);
        adminService.answerInquiry(csInquiry);
        return ResponseEntity.noContent().build();
    }

    // 15) 공지사항 - 등록
    @PostMapping("/announcements")
    public ResponseEntity<Void> addAnnouncement(@RequestBody Announcement announcement) {
        adminService.addAnnouncement(announcement);
        return ResponseEntity.created(URI.create("/api/admin/announcements")).build();
    }

    // 16) 공지사항 - 삭제
    @DeleteMapping("/announcements/{announcementId}")
    public ResponseEntity<Void> removeAnnouncement(@PathVariable Long announcementId) {
        adminService.removeAnnouncement(announcementId);
        return ResponseEntity.noContent().build();
    }

    // 17) 공지사항 - 수정
    @PutMapping("/announcements/{announcementId}")
    public ResponseEntity<Void> updateAnnouncement(@PathVariable Integer announcementId,
                                                   @RequestBody Announcement announcement) {
        // 서비스 시그니처가 Announcement 하나를 받으므로 ID를 주입해 호출
        announcement.setAnnouncementId(announcementId);
        adminService.updateAnnouncement(announcement);
        return ResponseEntity.noContent().build();
    }

    // 18) 공지사항 - 전체 조회
    @GetMapping("/announcements")
    public ResponseEntity<List<Announcement>> findAllAnnouncement() {
        return ResponseEntity.ok(adminService.findAllAnnouncement());
    }

    // 19) 공지사항 - 단건 조회
    @GetMapping("/announcements/{announcementId}")
    public ResponseEntity<Announcement> findAnnouncement(@PathVariable Integer announcementId) {
        return ResponseEntity.ok(adminService.findAnnouncement(announcementId));
    }

    // 20) 리뷰 신고 - 전체 조회
    @GetMapping("/reports/reviews")
    public ResponseEntity<List<ReviewReportResDTO>> findAllReviewReport() {
        return ResponseEntity.ok(adminService.findAllReviewReport());
    }

    // 21) 리뷰 신고 - 단건 조회
    @GetMapping("/reports/reviews/{reportId}")
    public ResponseEntity<ReviewReportResDTO> findReviewReport(@PathVariable Integer reportId) {
        return ResponseEntity.ok(adminService.findReviewReport(reportId));
    }

    // 22) 리뷰 신고 - 삭제
    @DeleteMapping("/reports/reviews/{reportId}")
    public ResponseEntity<Void> deleteReport(@PathVariable Integer reportId) {
        adminService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }
}
