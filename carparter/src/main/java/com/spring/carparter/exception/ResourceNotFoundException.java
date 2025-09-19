package com.spring.carparter.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 요청한 리소스를 찾을 수 없을 때 던지는 예외입니다.
 * 이 예외가 발생하면 클라이언트에게 HTTP 404 Not Found 상태 코드를 반환합니다.
 */
@ResponseStatus(HttpStatus.NOT_FOUND) // ✅ 이 어노테이션이 핵심입니다.
public class ResourceNotFoundException extends RuntimeException {

    /**
     * @param message 예외 메시지 (e.g., "ID 123에 해당하는 사용자를 찾을 수 없습니다.")
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}