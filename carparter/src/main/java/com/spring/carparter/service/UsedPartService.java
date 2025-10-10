package com.spring.carparter.service;

import com.spring.carparter.dto.UsedPartReqDTO;
import com.spring.carparter.dto.UsedPartResDTO;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.entity.UsedPart;
import com.spring.carparter.entity.UsedPartImage;
import com.spring.carparter.repository.CarCenterRepository;
import com.spring.carparter.repository.UsedPartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@Service
@RequiredArgsConstructor
public class UsedPartService {
    private final UsedPartRepository usedPartRepository;
    private final CarCenterRepository carCenterRepository;
    private final S3Service s3Service;

    @Transactional
    public UsedPartResDTO registerUsedPart(String centerID, UsedPartReqDTO req, List<MultipartFile> images) throws IOException {
        CarCenter carCenter = carCenterRepository.findById(centerID)
                .orElseThrow(() -> new IllegalArgumentException("카센터 정보를 찾을 수 없습니다."));

        UsedPart usedPart = req.toEntity();
        usedPart.setCarCenter(carCenter);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile imageFile : images) {
                String originalFilename = imageFile.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String objectKey = "used-parts/" + UUID.randomUUID().toString() + extension;

                String imageUrl = s3Service.uploadFile(imageFile, objectKey);
                usedPart.addImage(UsedPartImage.builder().imageUrl(imageUrl).build());
            }
        }

        UsedPart savedUsedPart = usedPartRepository.save(usedPart);
        return UsedPartResDTO.from(savedUsedPart, s3Service);
    }

    // ✅ [수정] 기존 중고 부품 정보를 수정합니다.
    @Transactional
    public UsedPartResDTO updateUsedPart(Integer partId, String centerId, UsedPartReqDTO requestDto, List<MultipartFile> newImages) throws IOException {
        UsedPart usedPart = usedPartRepository.findByIdWithImages(partId)
                .orElseThrow(() -> new IllegalArgumentException("수정할 부품 정보를 찾을 수 없습니다."));

        if (!usedPart.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("부품 정보를 수정할 권한이 없습니다.");
        }

        usedPart.updateInfo(requestDto);

        if (newImages != null && !newImages.isEmpty()) {
            usedPart.getImages().forEach(image -> s3Service.deleteFile(image.getImageUrl()));
            usedPart.getImages().clear();

            for (MultipartFile imageFile : newImages) {
                // [수정] 원본 파일 이름 대신 UUID와 확장자로 새로운 파일 키를 생성합니다.
                String originalFilename = imageFile.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String objectKey = "used-parts/" + UUID.randomUUID().toString() + extension;

                String imageUrl = s3Service.uploadFile(imageFile, objectKey);
                usedPart.addImage(UsedPartImage.builder().imageUrl(imageUrl).build());
            }
        }
        return UsedPartResDTO.from(usedPart, s3Service);
    }

    /**
     * 중고 부품을 삭제합니다.
     */
    @Transactional
    public void deleteUsedPart(Integer partId, String centerId) {
        UsedPart usedPart = usedPartRepository.findByIdWithImages(partId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 부품 정보를 찾을 수 없습니다."));

        if (!usedPart.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("부품 정보를 삭제할 권한이 없습니다.");
        }

        usedPart.getImages().forEach(image -> s3Service.deleteFile(image.getImageUrl()));
        usedPartRepository.delete(usedPart);
    }

    /**
     * 특정 카센터가 등록한 모든 중고 부품 목록을 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<UsedPartResDTO> getMyUsedParts(String centerId) {
        List<UsedPart> usedParts = usedPartRepository.findByCarCenter_CenterIdWithImages(centerId);
        return usedParts.stream()
                .map(part -> UsedPartResDTO.from(part, s3Service))
                .collect(Collectors.toList());
    }

    /**
     * 중고 부품 하나의 상세 정보를 조회합니다.
     */
    @Transactional(readOnly = true)
    public UsedPartResDTO getUsedPartDetails(Integer partId) {
        UsedPart usedPart = usedPartRepository.findByIdWithImages(partId)
                .orElseThrow(() -> new IllegalArgumentException("해당 부품을 찾을 수 없습니다. id=" + partId));
        return UsedPartResDTO.from(usedPart, s3Service);
    }

    /**
     * 부품 이름으로 부품을 검색합니다.
     */
    @Transactional(readOnly = true)
    public List<UsedPartResDTO> searchPartsByName(String partName) {
        return usedPartRepository.findByPartNameContainingIgnoreCase(partName)
                .stream()
                .map(part -> UsedPartResDTO.from(part, s3Service))
                .collect(Collectors.toList());
    }

    /**
     * ✅ [신규 추가] 최신 중고 부품 목록을 개수 제한하여 조회합니다. (홈페이지용)
     */
    @Transactional(readOnly = true)
    public List<UsedPartResDTO> getRecentUsedParts(int limit) {
        // Pageable 객체를 생성하여 0번째 페이지부터 limit 개수만큼 요청
        Pageable pageable = PageRequest.of(0, limit);

        // 레포지토리 호출
        Page<UsedPart> partPage = usedPartRepository.findAllByOrderByCreatedAtDesc(pageable);

        // 결과를 DTO 리스트로 변환 (Pre-signed URL 생성 포함)
        return partPage.getContent().stream()
                .map(part -> UsedPartResDTO.from(part, s3Service))
                .collect(Collectors.toList());
    }
}