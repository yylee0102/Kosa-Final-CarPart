package com.spring.carparter.service;

import com.spring.carparter.dto.AdminReqDTO;
import com.spring.carparter.dto.AdminResDTO;
import com.spring.carparter.entity.Admin;
import com.spring.carparter.entity.CarCenterApproval;
import com.spring.carparter.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * 1. 어드민 로그인
     * */
    public AdminResDTO login(AdminReqDTO req){
        Admin admin = adminRepository.findByAdminId(req.getAdminId()).
                orElseThrow(() -> new IllegalArgumentException("일치하는 아이디가 없습니다."));

        if(!req.getPassword().equals(admin.getPassword())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return AdminResDTO.From(admin);
    }

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
    public Long CarCenterCount(){
        return carCenterRepository.count();
    }

    /**
     * 6. 카센터 등록 대기 수
     * */
    public Long csInquiryCount(){
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
    public List<CarCenterApproval> getAllCenterApproval(){
        return carCenterApprovalRepository.findByProcessedAtIsNullOrderByRequestedAtAsc()
                                        .orElseThrow(() -> new RuntimeException("리스트 가져오는중 오류"));
    }

    /**
     * 9. 회원가입 승인 대기 중인 카센터 상세보기
     * */
    public CarCenterApproval getCenterApproval(Long approval_id){
        return carCenterApprovalRepository.findByApprovalId(approval_id)
                                        .orElseThrow(() -> new RuntimeException("상세 보기중 오류"));
    }
    /**
     * 10. 카센터 회원가입 반려
     * */
    @Transactional
    public String removeCenterApproval(Long approvalId, String reason) {
        if (!carCenterApprovalRepository.existsById(approvalId)) {
            throw new RuntimeException(approvalId + "찾지 못하였습니다."); // 404 매핑용 커스텀 예외 권장
        }
        carCenterApprovalRepository.deleteById(approvalId); // ← 딱 이 한 줄
        return reason;
    }

    /**
     * 11. 카센터 회원가입 승인
     * */
    @Transactional
    public void addCarCenter(Long approvalId) {

    }
}

