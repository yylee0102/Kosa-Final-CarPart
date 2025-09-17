package com.spring.carparter.controller;

import com.spring.carparter.dto.ReviewReportReqDTO;
import com.spring.carparter.dto.ReviewReportResDTO;
import com.spring.carparter.service.ReviewReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReviewReportController {

    private final ReviewReportService reviewReportService;

    @PostMapping
    public ResponseEntity<ReviewReportResDTO> createReport(@RequestBody ReviewReportReqDTO reqDto) {
        ReviewReportResDTO responseDto = reviewReportService.createReport(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}