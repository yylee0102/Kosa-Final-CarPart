package com.spring.carparter.service;

import com.spring.carparter.dto.EstimateReqDTO;
import com.spring.carparter.dto.EstimateResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Estimate;
import com.spring.carparter.entity.QuoteRequest;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.EstimateRepository;
import com.spring.carparter.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final CarCenterRepository carCenterRepository;

    // 1. 견적서 제출
    @Transactional
    public EstimateResDTO submitEstimate(String centerId, EstimateReqDTO requestDto) {
        CarCenter carCenter = carCenterRepository.findById(centerId)
                .orElseThrow(() -> new IllegalArgumentException("카센터 정보를 찾을 수 없습니다."));

        QuoteRequest quoteRequest = quoteRequestRepository.findById(requestDto.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("견적 요청 정보를 찾을 수 없습니다."));

        Estimate estimate = requestDto.toEntity();
        estimate.setCarCenter(carCenter);
        estimate.setQuoteRequest(quoteRequest);

        Estimate savedEstimate = estimateRepository.save(estimate);

        return EstimateResDTO.from(savedEstimate);
    }

    // 2. 내가 제출한 견적서 목록 조회
    @Transactional(readOnly = true)
    public List<EstimateResDTO> getMyEstimates(String centerId) {
        List<Estimate> estimates = estimateRepository.findByCarCenter_CenterIdWithItems(centerId);

        return estimates.stream()
                .map(EstimateResDTO::from)
                .collect(Collectors.toList());
    }

    // 3. 특정 견적서 상세 조회 (Read)
    @Transactional(readOnly = true)
    public EstimateResDTO getEstimateDetails(Integer estimateId) {
        Estimate estimate = estimateRepository.findByIdWithItems(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("견적서를 찾을 수 없습니다."));

        return EstimateResDTO.from(estimate);
    }

    // 4. 견적서 삭제
    @Transactional
    public void deleteEstimate(String centerId, Integer estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 견적서를 찾을 수 없습니다."));

        if (!estimate.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("견적서를 삭제할 권한이 없습니다.");
        }

        estimateRepository.delete(estimate);
    }

    //5. 견적서 수정
    /**
     * 5. 견적서 수정
     * @param estimateId 수정할 견적서 ID
     * @param centerId 수정을 요청한 정비소 ID (권한 확인용)
     * @param requestDto 새로운 견적서 정보 DTO
     * @return 수정된 견적서 정보 DTO
     */
    @Transactional
    public EstimateResDTO updateEstimate(Integer estimateId, String centerId, EstimateReqDTO requestDto) {

        Estimate estimate = estimateRepository.findByIdWithItems(estimateId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 견적서를 찾을 수 없습니다."));

        // 2. 이 견적서를 수정할 권한이 있는지 확인합니다.
        if (!estimate.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("견적서를 수정할 권한이 없습니다.");
        }

        // 3. 견적서의 기본 정보를 새로운 내용으로 업데이트합니다.
        estimate.setEstimatedCost(requestDto.getEstimatedCost());
        estimate.setDetails(requestDto.getDetails());


        estimate.getEstimateItems().clear();


        if (requestDto.getEstimateItems() != null) {
            requestDto.getEstimateItems().forEach(itemDto -> {
                estimate.addEstimateItem(itemDto.toEntity());
            });
        }

        return EstimateResDTO.from(estimate);
    }


}