package com.spring.carparter.service;

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

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class CompletedRepairService {
    private final CarCenterRepository carCenterRepository;
    private final EstimateRepository estimateRepository;
    private final CompletedRepairRepository completedRepairRepository;
    private final UserRepository userRepository;


    void makeCompletedRepair(Estimate estimate,String userId) {
        CarCenter carCenter = carCenterRepository.findById(estimate.getCarCenter().getCenterId()).orElseThrow();
        Estimate savedEstimate = estimateRepository.findById(estimate.getEstimateId()).orElseThrow();
        // CompletedRepair completedRepair = request.toEntity(user, carCenter);
        // Mango id
        User user = userRepository.findByUserId(userId);

        CompletedRepair completedRepair = CompletedRepair.builder()
                .user(user)
                .carCenter(carCenter)
                .repairDetail(estimate.getDetails())
                .completionDate(LocalDateTime.now())
                .build();

        completedRepairRepository.save(completedRepair);


    }
}
