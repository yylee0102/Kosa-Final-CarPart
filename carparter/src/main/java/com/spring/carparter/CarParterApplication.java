package com.spring.carparter;

import com.spring.carparter.entity.*; // 모든 엔티티 import
import com.spring.carparter.repository.*; // 모든 레포지토리 import
import com.spring.carparter.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@EnableScheduling // 스케줄링 기능 활성화 (carcenter 예약 알아서 삭제 시킬거)
@EnableJpaAuditing
@SpringBootApplication
@Component
@RequiredArgsConstructor
public class CarParterApplication implements ApplicationRunner, CommandLineRunner {

    //== 모든 Repository 의존성 주입 ==//
    @Autowired
    private final QuoteRequestRepository quoteRepo;
    @Autowired
    private RequestImageRepository imageRepo;
    @Autowired
    private EstimateRepository estimateRepo;
    @Autowired
    private CompletedRepairRepository completedRepairRepo;
    @Autowired
    private CarCenterRepository carCenterRepo;
    @Autowired
    private ReservationRepository reservationRepo;
    @Autowired
    private ReviewRepository reviewRepo;
    @Autowired
    private ReviewReplyRepository reviewReplyRepo;
    @Autowired
    private UsedPartRepository usedPartRepo;
    @Autowired
    private UsedPartImageRepository usedPartImageRepo;
    @Autowired
    private ChatRoomRepository chatRoomRepo;


    public static void main(String[] args) {
        SpringApplication.run(CarParterApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

//        //=========================================================
//        // ✅ QuoteRequest Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ QuoteRequest Repository 스모크 테스트 시작 =================");
//
//        // [테스트 1] 기본 카운트
//        try {
//            long count = quoteRepo.count();
//            System.out.println("🧪 [테스트1] quote_requests 총 개수 = " + count);
//        } catch (Exception e) {
//            System.out.println("❌ [테스트1 실패] count() 에러: " + e.getMessage());
//        }
//
//        // [테스트 2] findById (EntityGraph: user, userCar 포함)
//        try {
//            Optional<QuoteRequest> qr = quoteRepo.findById(1);
//            qr.ifPresentOrElse(
//                    q -> System.out.println("🧪 [테스트2] findById(1) 성공 → 요청내용: " + safe(q.getRequestDetails())),
//                    () -> System.out.println("⚠️ [테스트2] findById(1) 결과 없음")
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트2 실패] findById(1) 에러: " + e.getMessage());
//        }
//
//        // [테스트 3] 특정 사용자 요청 목록 (JOIN FETCH)
//        try {
//            List<QuoteRequest> list = quoteRepo.findUserRequestsWithDetails("user01");
//            System.out.println("🧪 [테스트3] user01 요청 개수 = " + list.size());
//            list.stream().limit(3).forEach(qr ->
//                    System.out.println("   - ID=" + qr.getRequestId() + ", 주소=" + safe(qr.getAddress()))
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트3 실패] findUserRequestsWithDetails(\"user01\") 에러: " + e.getMessage());
//        }
//
//        // [테스트 4] 상세 조회 (이미지 컬렉션만 Fetch Join)
//        try {
//            Optional<QuoteRequest> qr = quoteRepo.findByIdWithAllDetails(1);
//            qr.ifPresentOrElse(
//                    q -> System.out.println("🧪 [테스트4] 상세조회 성공 → ID=" + q.getRequestId()
//                            + ", 이미지수=" + (q.getRequestImages() == null ? 0 : q.getRequestImages().size())),
//                    () -> System.out.println("⚠️ [테스트4] findByIdWithAllDetails(1) 결과 없음")
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트4 실패] findByIdWithAllDetails(1) 에러: " + e.getMessage());
//        }
//
//        // [테스트 5] 주소 키워드 검색
//        try {
//            List<QuoteRequest> inSeoul = quoteRepo.findByAddressContaining("서울");
//            System.out.println("🧪 [테스트5] '서울' 포함 주소 개수 = " + inSeoul.size());
//            inSeoul.stream().limit(3).forEach(qr ->
//                    System.out.println("   - ID=" + qr.getRequestId() + ", 주소=" + safe(qr.getAddress()))
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트5 실패] findByAddressContaining(\"서울\") 에러: " + e.getMessage());
//        }
//
//        // [테스트 6] 특정 시간 이후 검색
//        try {
//            LocalDateTime 기준 = LocalDateTime.now().minusYears(1);
//            List<QuoteRequest> recent = quoteRepo.findByCreatedAtAfter(기준);
//            System.out.println("🧪 [테스트6] 최근 1년 내 생성 요청 개수 = " + recent.size());
//        } catch (Exception e) {
//            System.out.println("❌ [테스트6 실패] findByCreatedAtAfter() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ QuoteRequest Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ Estimate Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ Estimate Repository 스모크 테스트 시작 =================");
//
//        // [테스트 7] findByIdWithDetails (EstimateItem Fetch Join)
//        try {
//            Optional<Estimate> est = estimateRepo.findByIdWithItems(1);
//            est.ifPresentOrElse(
//                    e -> System.out.println("🧪 [테스트7] findByIdWithDetails(1) 성공 → 견적 항목 수: " + e.getEstimateItems().size()),
//                    () -> System.out.println("⚠️ [테스트7] findByIdWithDetails(1) 결과 없음")
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트7 실패] findByIdWithDetails() 에러: " + e.getMessage());
//        }
//
//        // [테스트 8] findItemsByEstimateId
//        try {
//            List<com.spring.carparter.entity.EstimateItem> items = estimateRepo.findItemsByEstimateId(1);
//            System.out.println("🧪 [테스트8] 견적서 ID=1의 항목 개수 = " + items.size());
//            items.forEach(item -> System.out.println("   - 항목명: " + safe(item.getItemName())));
//        } catch (Exception e) {
//            System.out.println("❌ [테스트8 실패] findItemsByEstimateId() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ Estimate Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ CompletedRepair Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ CompletedRepair Repository 스모크 테스트 시작 =================");
//
//        // [테스트 9] findByUser_UserIdWithDetails
//        try {
//            List<CompletedRepair> repairs = completedRepairRepo.findByUser_UserIdWithDetails("user01");
//            System.out.println("🧪 [테스트9] user01의 수리 완료 내역 개수 = " + repairs.size());
//            repairs.stream().limit(3).forEach(cr ->
//                    System.out.println("   - ID=" + cr.getRepairId() + ", 최종 비용=" + cr.getFinalCost() + ", 정비소=" + cr.getCarCenter().getCenterName())
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트9 실패] findByUser_UserIdWithDetails() 에러: " + e.getMessage());
//        }
//
//        // [테스트 10] existsByEstimate_EstimateId
//        try {
//            boolean exists = completedRepairRepo.existsByEstimate_EstimateId(1);
//            System.out.println("🧪 [테스트10] 견적서 ID=1에 대한 수리 완료 내역 존재 여부 = " + exists);
//        } catch (Exception e) {
//            System.out.println("❌ [테스트10 실패] existsByEstimate_EstimateId() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ CompletedRepair Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ RequestImage Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ RequestImage Repository 스모크 테스트 시작 =================");
//
//        // [테스트 11] 특정 견적 요청 ID로 이미지 목록 조회 (JPQL)
//        try {
//            List<RequestImage> images = imageRepo.findAllByRequestId(4);
//            System.out.println("🧪 [테스트11] ID=4 요청의 이미지 개수 = " + images.size());
//            images.forEach(img -> System.out.println("   - 이미지 URL: " + img.getImageUrl()));
//        } catch (Exception e) {
//            System.out.println("❌ [테스트11 실패] findAllByRequestId(4) 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ RequestImage Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ CarCenter Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ CarCenter Repository 스모크 테스트 시작 =================");
//
//        // [테스트 12] 이메일로 카센터 조회
//        try {
//            Optional<CarCenter> center = carCenterRepo.findByEmail("center01@example.com");
//            center.ifPresentOrElse(
//                    c -> System.out.println("🧪 [테스트12] findByEmail 성공 → 정비소명: " + safe(c.getCenterName())),
//                    () -> System.out.println("⚠️ [테스트12] findByEmail('center01@example.com') 결과 없음")
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트12 실패] findByEmail() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ CarCenter Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ Reservation Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ Reservation Repository 스모크 테스트 시작 =================");
//
//        // [테스트 13] 특정 카센터의 예약 목록 조회
//        try {
//            List<Reservation> reservations = reservationRepo.findAllByCenterId("center_id_1");
//            System.out.println("🧪 [테스트13] 카센터 ID 'center_id_1'의 예약 개수 = " + reservations.size());
//            reservations.stream().limit(3).forEach(r ->
//                    System.out.println("   - 예약ID=" + r.getReservationId() + ", 예약자=" + safe(r.getCustomerName()))
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트13 실패] findByCarCenter_CenterId() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ Reservation Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ Review & ReviewReply Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ Review & ReviewReply Repository 스모크 테스트 시작 =================");
//
//        // [테스트 14] 특정 카센터의 후기 목록 조회 (EntityGraph)
//        try {
//            List<Review> reviews = reviewRepo.findByCarCenter_CenterId("center_id_1");
//            System.out.println("🧪 [테스트14] 카센터 ID 'center_id_1'의 후기 개수 = " + reviews.size());
//            reviews.stream().limit(3).forEach(r ->
//                    System.out.println("   - 후기ID=" + r.getReviewId() + ", 작성자=" + (r.getUser() != null ? safe(r.getUser().getName()) : "정보없음") + ", 제목=" + safe(r.getTitle()))
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트14 실패] ReviewRepo:findByCarCenter_CenterId() 에러: " + e.getMessage());
//        }
//
//        // [테스트 15] 특정 후기에 달린 답변 조회
//        try {
//            Optional<ReviewReply> reply = reviewReplyRepo.findByReview_ReviewId(1);
//            reply.ifPresentOrElse(
//                    r -> System.out.println("🧪 [테스트15] 후기 ID=1의 답변 조회 성공 → 내용: " + safe(r.getContent())),
//                    () -> System.out.println("⚠️ [테스트15] 후기 ID=1에 대한 답변 결과 없음")
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트15 실패] findByReview_ReviewId() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ Review & ReviewReply Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ UsedPart & UsedPartImage Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ UsedPart & UsedPartImage Repository 스모크 테스트 시작 =================");
//
//        // [테스트 16] 특정 카센터의 중고부품 목록 조회
//        try {
//            List<UsedPart> parts = usedPartRepo.findByCarCenter_CenterId("center_id_1");
//            System.out.println("🧪 [테스트16] 카센터 ID 'center_id_1'의 중고부품 개수 = " + parts.size());
//            parts.stream().limit(3).forEach(p ->
//                    System.out.println("   - 부품명=" + safe(p.getPartName()) + ", 가격=" + p.getPrice())
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트16 실패] UsedPartRepo:findByCarCenter_CenterId() 에러: " + e.getMessage());
//        }
//
//        // [테스트 17] 특정 중고부품의 이미지 목록 조회
//        try {
//            List<UsedPartImage> images = usedPartImageRepo.findByUsedPart_PartId(1);
//            System.out.println("🧪 [테스트17] 중고부품 ID=1의 이미지 개수 = " + images.size());
//            images.forEach(img -> System.out.println("   - 이미지 URL: " + img.getImageUrl()));
//        } catch (Exception e) {
//            System.out.println("❌ [테스트17 실패] findByUsedPart_PartId() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ UsedPart & UsedPartImage Repository 스모크 테스트 종료 =================\n");
//
//
//        //=========================================================
//        // ✅ ChatRoom Repository 스모크 테스트
//        //=========================================================
//        System.out.println("\n================= ✅ ChatRoom Repository 스모크 테스트 시작 =================");
//
//        // [테스트 18] 특정 사용자, 카센터, 견적요청으로 채팅방 조회 (JPQL)
//        try {
//            Optional<ChatRoom> chatRoom = chatRoomRepo.findChatRoomByAllIds("user01", "center_id_1", 1);
//            chatRoom.ifPresentOrElse(
//                    cr -> System.out.println("🧪 [테스트18] 채팅방 조회 성공 → 채팅방ID: " + cr.getRoomId()),
//                    () -> System.out.println("⚠️ [테스트18] 조건에 맞는 채팅방 결과 없음")
//            );
//        } catch (Exception e) {
//            System.out.println("❌ [테스트18 실패] findChatRoomByAllIds() 에러: " + e.getMessage());
//        }
//        System.out.println("================= ✅ ChatRoom Repository 스모크 테스트 종료 =================\n");
//    }
//
//    /**
//     * NullPointerException 방지를 위한 간단한 헬퍼 메서드
//     */
//    private String safe(String s) {
//        return (s == null ? "(null)" : s);
//    }
    }

    private final AdminService adminService;
    @Override
    public void run(String... args) throws Exception {
//        System.out.println(adminService.getCenterApproval(1L));
    }
}