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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsedPartService {
        private final UsedPartRepository usedPartRepository;
        private final CarCenterRepository carCenterRepository;
//        private final S3UploaderService s3UploaderService; // S3 업로드 및 삭제 서비스

    //1. 중고 부품 등록
    @Transactional
    public UsedPartResDTO registerUsedPart(String centerID, UsedPartReqDTO req,List<MultipartFile> images){
        CarCenter carCenter = carCenterRepository.findById(centerID)
                .orElseThrow(()-> new IllegalArgumentException("카센터 정보를 찾을수 없습니다."));

        UsedPart usedPart = req.toEntity();
        usedPart.setCarCenter(carCenter);

          /*
        // S3 이미지 업로드 로직
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String imageUrl = s3UploaderService.upload(image, "used-parts");
                usedPart.addImage(UsedPartImage.builder().imageUrl(imageUrl).build());
            }
        }
        */
        UsedPart savedUsedPart = usedPartRepository.save(usedPart);
        return UsedPartResDTO.from(savedUsedPart);

    }

    //2. 내가 등록한 모든 중고 부품 조회
    public List<UsedPartResDTO> getMyUsedParts(String centerId){
        List<UsedPart> usedParts = usedPartRepository.findByCarCenter_CenterIdWithImages(centerId);

    return usedParts.stream()
            .map(UsedPartResDTO::from)
            .collect(Collectors.toList());
    }

    //3. 중고 부품 정보 수정
    @Transactional
    public UsedPartResDTO updateUsedPart(Integer partId, String centerId, UsedPartReqDTO requestDto, List<MultipartFile> newImages) throws IOException {
        UsedPart usedPart = usedPartRepository.findByIdWithImages(partId)
                .orElseThrow(()->new IllegalArgumentException("수정할 부품 정보를 찾지 못했습니다."));

        if (!usedPart.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("부품 정보를 수정할 권한이 없습니다.");
        }

        usedPart.updateInfo(requestDto);
/*
        //s3 이미지 수정 로직 임시 주석
        if (newImages != null && !newImages.isEmpty()) {
            // S3에서 기존 이미지 파일 삭제
            // usedPart.getImages().forEach(image -> s3UploaderService.delete(image.getImageUrl()));

            // DB에서 기존 이미지 정보 삭제
            usedPart.getImages().clear();

            // 새 이미지 S3에 업로드 후 DB에 정보 추가
            for (MultipartFile image : newImages) {
                String imageUrl = s3UploaderService.upload(image, "used-parts");
                usedPart.addImage(UsedPartImage.builder().imageUrl(imageUrl).build());
            }
        }
 */
        UsedPart updatedUsedPart = usedPartRepository.save(usedPart);
        return UsedPartResDTO.from(updatedUsedPart);
    }
    // 4. 중고 부품 등록 삭제
    @Transactional
    public void deleteUsedPart(Integer partId, String centerId) {
        UsedPart usedPart = usedPartRepository.findByIdWithImages(partId)
                .orElseThrow(() -> new IllegalArgumentException("삭제할 부품 정보를 찾을 수 없습니다."));

        if (!usedPart.getCarCenter().getCenterId().equals(centerId)) {
            throw new SecurityException("부품 정보를 삭제할 권한이 없습니다.");
        }

        /*
        // S3 이미지 삭제 로직 임시 주석 처리
        // DB에서 삭제하기 전에 S3의 실제 파일을 먼저 삭제해야 합니다.
        // usedPart.getImages().forEach(image -> s3UploaderService.delete(image.getImageUrl()));
        */

        // DB에서 부품 정보 삭제
        usedPartRepository.delete(usedPart);
    }
    /**
     * 중고 부품 상세 조회
     * @param partId 조회할 부품의 ID
     * @return 중고 부품 상세 정보 DTO
     */
    @Transactional(readOnly = true) // 데이터 변경이 없는 조회이므로 readOnly 옵션으로 성능 최적화
    public UsedPartResDTO getUsedPartDetails(Integer partId) {
        // Repository를 통해 부품 정보와 이미지 정보를 한 번에 가져옵니다.
        UsedPart usedPart = usedPartRepository.findByIdWithImages(partId)
                .orElseThrow(() -> new IllegalArgumentException("해당 부품을 찾을 수 없습니다. id=" + partId));

        // Entity를 DTO로 변환하여 반환합니다.
        return UsedPartResDTO.from(usedPart);
    }


}
