package com.spring.carparter.service;

import com.spring.carparter.dto.ReviewReqDTO;
import com.spring.carparter.dto.ReviewResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.CompletedRepair;
import com.spring.carparter.entity.Review;
import com.spring.carparter.entity.User;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.CompletedRepairRepository;
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
    private final CompletedRepairRepository completedRepairRepository;

    @Transactional
    public ReviewResDTO createReview(ReviewReqDTO reqDto,String userId) {

        // ▼▼▼ [핵심] 기존 리뷰가 있는지 확인하는 로직 추가 ▼▼▼
        if (reqDto.getRepairId() != null && reviewRepository.existsByCompletedRepair_Id(reqDto.getRepairId())) {
            throw new IllegalStateException("이미 이 수리 내역에 대한 리뷰가 작성되었습니다.");
        }




        CarCenter carCenter = carCenterRepository.findById(reqDto.getCenterId())
                .orElseThrow(() -> new IllegalArgumentException("정비소를 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // ▼▼▼ [핵심] CompletedRepair를 찾아서 Review에 연결 ▼▼▼
        CompletedRepair completedRepair = completedRepairRepository.findById(reqDto.getRepairId())
                .orElseThrow(() -> new IllegalArgumentException("수리 내역을 찾을 수 없습니다."));

        Review review = reqDto.toEntity(carCenter, user);
        review.setCompletedRepair(completedRepair);

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
    public ReviewResDTO updateReview(Integer reviewId, ReviewReqDTO reqDto,String userId) { // ✅ Long -> Integer로 수정
        Review review = reviewRepository.findById(reviewId) // ✅ .longValue() 없이 바로 사용
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        review.setUser(user);
        // TODO: 리뷰 작성자와 수정 요청자가 동일한지 확인하는 로직 추가(로그인 후에 하는거라 상관없다)
        // if (!review.getUser().getUserId().equals(reqDto.getUserId())) { ... }
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

    @Transactional(readOnly = true)
    public List<ReviewResDTO> getReviewListByUserId(String userId) {
        return reviewRepository.findAllByUser_UserId(userId).stream()
                .map(ReviewResDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * [신규 추가] ID로 특정 리뷰를 조회하여 DTO로 반환합니다.
     */
    @Transactional(readOnly = true)
    public ReviewResDTO getReviewById(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
        return ReviewResDTO.from(review);
    }


}