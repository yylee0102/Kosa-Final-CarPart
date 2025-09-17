package com.spring.carparter.service;

import com.spring.carparter.dto.ReviewReqDTO;
import com.spring.carparter.dto.ReviewResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.ReviewRepository;
import com.spring.carparter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CarCenterRepository carCenterRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResDTO createReview(ReviewReqDTO reqDto) {
        CarCenter carCenter = carCenterRepository.findById(reqDto.getCenterId())
                .orElseThrow(() -> new IllegalArgumentException("정비소를 찾을 수 없습니다."));
        User user = userRepository.findById(reqDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Review review = reqDto.toEntity(carCenter, user);

        Review savedReview = reviewRepository.save(review);
        return ReviewResDTO.from(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResDTO> getReviewsForCarCenter(String centerId) {
        return reviewRepository.findByCarCenter_CenterId(centerId).stream()
                .map(ReviewResDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResDTO updateReview(Integer reviewId, ReviewReqDTO reqDto) { // ✅ Long -> Integer로 수정
        Review review = reviewRepository.findById(reviewId) // ✅ .longValue() 없이 바로 사용
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        // TODO: 리뷰 작성자와 수정 요청자가 동일한지 확인하는 로직 추가
        // if (!review.getUser().getUserId().equals(reqDto.getUserId())) { ... }

        review.setTitle(reqDto.getTitle());
        review.setContent(reqDto.getContent());
        review.setRating(reqDto.getRating());
        return ReviewResDTO.from(review);
    }

    @Transactional
    public void deleteReview(Integer reviewId) { // ✅ Long -> Integer로 수정
        if (!reviewRepository.existsById(reviewId)) { // ✅ .longValue() 없이 바로 사용
            throw new IllegalArgumentException("삭제할 리뷰를 찾을 수 없습니다.");
        }
        reviewRepository.deleteById(reviewId);
    }
}