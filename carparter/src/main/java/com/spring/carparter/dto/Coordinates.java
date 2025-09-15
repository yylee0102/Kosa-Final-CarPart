package com.spring.carparter.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 위도(latitude)와 경도(longitude) 좌표값을 담는 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Coordinates {

    private Double latitude; // 위도
    private Double longitude; // 경도

}
