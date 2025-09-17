package com.spring.carparter.controller;

import com.spring.carparter.dto.ReviewReplyReqDTO;
import com.spring.carparter.dto.ReviewReplyResDTO;
import com.spring.carparter.service.ReviewReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/replies") // 답변 관련 API는 /api/replies 경로 사용
public class ReviewReplyController {

    private final ReviewReplyService reviewReplyService;

    /**
     * 1. 리뷰 답변 생성 API
     * POST /api/replies
     */
    @PostMapping
    public ResponseEntity<ReviewReplyResDTO> createReply(@RequestBody ReviewReplyReqDTO reqDto) {
        ReviewReplyResDTO responseDto = reviewReplyService.createReply(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    /**
     * 2. 리뷰 답변 수정 API
     * PUT /api/replies/{replyId}
     */
    @PutMapping("/{replyId}")
    public ResponseEntity<ReviewReplyResDTO> updateReply(@PathVariable Integer replyId, @RequestBody ReviewReplyReqDTO reqDto) {
        ReviewReplyResDTO updatedDto = reviewReplyService.updateReply(replyId, reqDto);
        return ResponseEntity.ok(updatedDto);
    }

    /**
     * 3. 리뷰 답변 삭제 API
     * DELETE /api/replies/{replyId}
     */
    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Integer replyId) {
        reviewReplyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }
}