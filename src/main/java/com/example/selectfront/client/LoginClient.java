package com.example.selectfront.client;


import com.example.selectfront.dto.findMemberResponseDTO;
import com.example.selectfront.dto.member.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "LoginClient", url = "${swfm.auth-url}")
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
    EmailVerifyResponseDTO emailSend(@RequestHeader("Session-Id") String sessionId, @RequestBody EmailRequestDTO emailUserIdRequestDTO);

    @PostMapping("/verity/verify-email")
    EmailVerifyResponseDTO verifyEmail(@RequestHeader("Session-Id") String sessionId,@RequestBody EmailVerificationRequestDTO emailRequestDTO);

    @PostMapping("/find/user/find-id")
    findMemberResponseDTO findId(@RequestBody EmailRequestDTO email);

    @PostMapping("/find/user/send-pw")
    findMemberResponseDTO sendResetPwd(@RequestBody EmailUserIdRequestDTO emailUserIdRequestDTO);

    @PostMapping("/find/user/update-pw")
    findMemberResponseDTO resetPwd(@RequestBody UpdatePwTokenRequestDTO updatePwTokenRequestDTO);

    @PostMapping("/auths/claims")
    ClaimsResponseDTO getClaims(@RequestBody ClaimsRequestDTO claimsRequestDTO);
}
