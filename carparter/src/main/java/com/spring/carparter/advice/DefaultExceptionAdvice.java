package com.spring.carparter.advice;

import com.spring.carparter.exception.DuplicateException;
import com.spring.carparter.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

// 모든 REST 컨트롤러에서 발생하는 예외를 전역적으로 처리합니다.
@RestControllerAdvice
public class DefaultExceptionAdvice {

    // ResourceNotFoundException 처리 (404 Not Found)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        problemDetail.setTitle(" 리소스를 찾을 수 없음");
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        return problemDetail;
    }

    // DuplicateException 처리 (409 Conflict)
    @ExceptionHandler(DuplicateException.class)
    public ProblemDetail handleDuplicateException(DuplicateException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
        problemDetail.setTitle("데이터 중복");
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        return problemDetail;
    }

    //  SecurityException 처리 (403 Forbidden - 권한 없음)
    @ExceptionHandler(SecurityException.class)
    public ProblemDetail handleSecurityException(SecurityException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, e.getMessage());
        problemDetail.setTitle("접근 권한 없음");
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        return problemDetail;
    }

    //  IllegalArgumentException 처리 (400 Bad Request - 잘못된 요청)
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgumentException(IllegalArgumentException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
        problemDetail.setTitle("잘못된 요청");
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        return problemDetail;
    }

    // 나머지 모든 예외 처리 (500 Internal Server Error)
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(Exception e) {
        // 실제 운영 환경에서는 e.getMessage()를 로그로만 남기고,
        // 사용자에게는 "서버 내부에서 오류가 발생했습니다."와 같은 일반적인 메시지를 보여주는 것이 좋습니다.
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        problemDetail.setTitle("서버 내부 오류");
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        return problemDetail;
    }
}