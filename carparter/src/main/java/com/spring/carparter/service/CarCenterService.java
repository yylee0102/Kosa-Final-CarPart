package com.spring.carparter.service;

import com.spring.carparter.dto.CarCenterReqDTO;
import com.spring.carparter.dto.CarCenterResDTO;
import com.spring.carparter.dto.Coordinates;
import com.spring.carparter.entity.CarCenter;
import com.spring.carparter.exception.DuplicateException;
import com.spring.carparter.repository.CarCenterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // ✅ 임포트 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarCenterService {


}