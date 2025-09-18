package com.spring.carparter.dto;

import com.spring.carparter.entity.CompletedRepair;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompletedRepairResDTO {

    private Integer repairId;
    private String repairDetail;
    private LocalDateTime completionDate;
    private String userId;
    private String userName; // 사용자 이름 추가
    private String centerId;
    private String centerName; // 정비소 이름 추가

    /**
     * 엔티티를 DTO로 변환하는 정적 팩토리 메서드
     * @param entity CompletedRepair 엔티티
     * @return 변환된 DTO
     */
    public static CompletedRepairResDTO from(CompletedRepair entity) {
        return CompletedRepairResDTO.builder()
                .repairId(entity.getRepairId())
                .repairDetail(entity.getRepairDetail())
                .completionDate(entity.getCompletionDate())
                .userId(entity.getUser().getUserId()) // User 엔티티의 ID (getter 필요)
                .userName(entity.getUser().getName()) // User 엔티티의 이름 (getter 필요)
                .centerId(entity.getCarCenter().getCenterId()) // CarCenter 엔티티의 ID (getter 필요)
                .centerName(entity.getCarCenter().getCenterName()) // CarCenter 엔티티의 이름 (getter 필요)
                .build();
    }
}