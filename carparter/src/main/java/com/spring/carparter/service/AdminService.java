package com.spring.carparter.service;

import com.spring.carparter.dto.AdminReqDTO;
import com.spring.carparter.dto.AdminResDTO;
import com.spring.carparter.entity.Admin;
import com.spring.carparter.repository.AdminRepository;
import com.spring.carparter.repository.UserRepository;
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

        // 10~50대까지는 항상 키가 존재하도록 0으로 메꿔줌
        for (String k : new String[]{"10s","20s","30s","40s","50s"}) {
            map.putIfAbsent(k, 0);
        }

        return map;
    }
}