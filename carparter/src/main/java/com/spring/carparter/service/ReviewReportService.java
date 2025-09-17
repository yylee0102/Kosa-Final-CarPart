package com.spring.carparter.service;

import com.spring.carparter.dto.ReviewReportReqDTO;
import com.spring.carparter.dto.ReviewReportResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.ReviewReport;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ReviewRepository;
import com.spring.carparter.repository.ReviewReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewReportService {

    private final ReviewReportRepository reviewReportRepository;
    private final ReviewRepository reviewRepository;
    private final CarCenterRepository carCenterRepository;

    @Transactional
    public ReviewReportResDTO createReport(ReviewReportReqDTO reqDto) {
        Review review = reviewRepository.findById(reqDto.getReviewId())
                .orElseThrow(() -> new IllegalArgumentException("신고할 리뷰를 찾을 수 없습니다."));

        CarCenter carCenter = carCenterRepository.findById(reqDto.getCenterId())
                .orElseThrow(() -> new IllegalArgumentException("신고 주체인 정비소를 찾을 수 없습니다."));

        ReviewReport report = reqDto.toEntity(review, carCenter);
        ReviewReport savedReport = reviewReportRepository.save(report);

        return ReviewReportResDTO.from(savedReport);
    }
}