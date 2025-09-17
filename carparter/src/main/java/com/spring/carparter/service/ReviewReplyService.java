package com.spring.carparter.service;

import com.spring.carparter.dto.ReviewReplyReqDTO;
import com.spring.carparter.dto.ReviewReplyResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.ReviewReply;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ReviewRepository;
import com.spring.carparter.repository.ReviewReplyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewReplyService {

    private final ReviewReplyRepository reviewReplyRepository;
    private final ReviewRepository reviewRepository;
    private final CarCenterRepository carCenterRepository;

    // 1. 답변 생성
    @Transactional
    public ReviewReplyResDTO createReply(ReviewReplyReqDTO reqDto) {
        Review review = reviewRepository.findById(reqDto.getReviewId().intValue())
                .orElseThrow(() -> new IllegalArgumentException("답변할 리뷰를 찾을 수 없습니다."));
        CarCenter carCenter = carCenterRepository.findById(reqDto.getCenterId())
                .orElseThrow(() -> new IllegalArgumentException("정비소를 찾을 수 없습니다."));

        // (추가) 리뷰를 받은 정비소와 답변을 작성하는 정비소가 동일한지 확인 로직
        // if (!review.getCarCenter().getCenterId().equals(carCenter.getCenterId())) { ... }

        ReviewReply reply = ReviewReply.builder()
                .review(review)
                .carCenter(carCenter)
                .content(reqDto.getContent())
                .build();

        ReviewReply savedReply = reviewReplyRepository.save(reply);
        return ReviewReplyResDTO.from(savedReply);
    }

    // 2. 답변 수정
    @Transactional
    public ReviewReplyResDTO updateReply(Integer replyId, ReviewReplyReqDTO reqDto) {
        ReviewReply reply = reviewReplyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 답변을 찾을 수 없습니다."));

        // (추가) 답변을 작성한 정비소만 수정 가능하도록 확인 로직
        // if (!reply.getCarCenter().getCenterId().equals(reqDto.getCenterId())) { ... }

        reply.setContent(reqDto.getContent());
        return ReviewReplyResDTO.from(reply);
    }

    // 3. 답변 삭제
    @Transactional
    public void deleteReply(Integer replyId) {
        if (!reviewReplyRepository.existsById(replyId)) {
            throw new IllegalArgumentException("삭제할 답변을 찾을 수 없습니다.");
        }
        reviewReplyRepository.deleteById(replyId);
    }
}