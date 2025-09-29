package com.spring.carparter.service;

import com.spring.carparter.dto.CompletedRepairResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CompletedRepair;
import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.CompletedRepairRepository;
import com.spring.carparter.repository.EstimateRepository;
import com.spring.carparter.repository.QuoteRequestRepository;
import com.spring.carparter.repository.UserRepository;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.RequiredArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CompletedRepairService {

    private  final CompletedRepairRepository completedRepairRepository;

    /**
     * 특정 사용자의 모든 수리 완료 내역을 조회합니다.
     * @param userId 사용자의 ID
     * @return 수리 내역 DTO 리스트
     */
    @Transactional(readOnly = true)
    public List<CompletedRepairResDTO> getCompletedRepairListByUserId(String userId) {
         List<CompletedRepair> repairs = completedRepairRepository.findAllByUser_UserId(userId);
         return repairs.stream()
                 .map(CompletedRepairResDTO::from) // DTO 변환 메소드 필요
                 .collect(Collectors.toList());
        return List.of(); // 임시 반환
    }

    /**
     * 특정 카센터의 모든 수리 완료 내역을 조회합니다.
     * @param centerId 카센터의 ID
     * @return 수리 내역 DTO 리스트
     */
    @Transactional(readOnly = true)
    public List<CompletedRepairResDTO> getCompletedRepairListByCenterId(String centerId) {
        // TODO: CompletedRepairRepository에 findByCarCenter_CenterId 메소드 추가 필요
        // List<CompletedRepair> repairs = completedRepairRepository.findByCarCenter_CenterId(centerId);
        // return repairs.stream()
        //         .map(CompletedRepairResDTO::from)
        //         .collect(Collectors.toList());
        return List.of(); // 임시 반환
    }

    /**
     * 수리를 완료 상태로 변경합니다. (카센터용)
     * @param repairId 완료 처리할 수리 내역의 ID
     * @param centerId 요청한 카센터의 ID (권한 확인용)
     */
    @Transactional

    public void markAsCompleted(Long repairId, String centerId) {
        CompletedRepair repair = completedRepairRepository.findById(repairId)
                .orElseThrow(() -> new RuntimeException("수리 내역을 찾을 수 없습니다."));

        if (!repair.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("수리 내역을 완료할 권한이 없습니다.");
        }

        // TODO: RepairStatus Enum에 COMPLETED 추가하고 상태 변경
        // repair.setStatus(RepairStatus.COMPLETED);
        // repair.setCompletedAt(LocalDateTime.now());
    }


}
