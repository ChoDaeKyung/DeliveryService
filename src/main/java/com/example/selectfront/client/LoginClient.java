package com.example.selectfront.client;


import com.example.selectfront.dto.member.*;
import com.example.tobi.selectfront.dto.member.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "LoginClient", url = "${feign-data.url}")
public interface LoginClient {

    //POST 데이터 요청 (데이터 생성)
    @PostMapping("/api/users/login")
    UserLoginResponseDTO login(@RequestBody LoginRequestDTO orderRequestDTO);
    @PostMapping("/api/users/join")
    ResponseEntity<String> join(@RequestBody JoinRequestDTO loginRequestDTO);

    @PostMapping("/api/users/check-id")
    boolean checkId(@RequestBody String userId);
    @PostMapping("/api/users/check-nickName")
    boolean checkName(@RequestBody String nickName);

    @PostMapping("/auths/refresh")
    RefreshTokenResponseDTO refreshTokenUpdate(@RequestBody String refreshToken);

    @PostMapping("/verity/send-verification-email")
    EmailVerifyResponseDTO emailSend(@RequestBody EmailRequestDTO emailRequestDTO);

    @PostMapping("/verity/verify-email")
    EmailVerifyResponseDTO verifyEmail(@RequestBody EmailVerificationRequestDTO emailRequestDTO);
}
