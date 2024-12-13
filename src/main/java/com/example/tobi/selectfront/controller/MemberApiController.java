package com.example.tobi.selectfront.controller;

import com.example.tobi.selectfront.dto.member.*;
import com.example.tobi.selectfront.service.EmailVerifyService;
import com.example.tobi.selectfront.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.CookieUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member/api")
public class MemberApiController {

    private final MemberService memberService;
    private final EmailVerifyService emailVerifyService;
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinRequestDTO loginRequestDTO) {
        return memberService.joinMember(loginRequestDTO);
    }
    @PostMapping("/check-id")
    public ResponseEntity<duplicationCheckResponseDTO> checkId(@RequestBody IdCheckRequestDTO idCheckDTO) {
        boolean isAvailable = memberService.checkId(idCheckDTO.getId());
        duplicationCheckResponseDTO responseDTO = duplicationCheckResponseDTO.builder()
                .isAvailable(isAvailable)
                .build();
        return ResponseEntity.ok(responseDTO);
    }
    @PostMapping("/check-nickname")
    public ResponseEntity<duplicationCheckResponseDTO> checkId(@RequestBody NickNameCheckDTO nickname) {
        duplicationCheckResponseDTO build = duplicationCheckResponseDTO.builder().isAvailable(memberService.checkNickname(nickname.getNickName())).build();
        return ResponseEntity.ok(build);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDTO> login(HttpServletResponse response, @RequestBody LoginRequestDTO loginRequestDTO) {
        UserLoginResponseDTO userLoginResponseDTO = memberService.loginMember(loginRequestDTO);
        CookieUtil.addCookie(response,"refreshToken",userLoginResponseDTO.getRefreshToken(),7*24*60*60);
        if (userLoginResponseDTO.isLoggedIn()) {
            return ResponseEntity.ok(
                    UserLoginResponseDTO.builder()
                            .accessToken(userLoginResponseDTO.getAccessToken())
                            .build()
            );
        } else {
            // 로그인 실패 시, 상태 코드 401 (Unauthorized)와 실패 메시지 반환
            return (ResponseEntity<UserLoginResponseDTO>) ResponseEntity.status(HttpStatus.UNAUTHORIZED);
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDTO> logout(HttpServletRequest request, HttpServletResponse response) {
        CookieUtil.deleteCookie(request, response,"refreshToken");

        return ResponseEntity.ok(
                LogoutResponseDTO.builder()
                        .url("/login")
                        .message("로그아웃 성공")
                        .build()
        );
    }



    @PostMapping("/send-verification-email")
    public EmailVerifyResponseDTO sendVerificationEmail(HttpSession session, @RequestBody EmailRequestDTO emailRequest) {
        System.out.println("Session ID: " + session.getId());

        System.out.println("email: " + emailRequest.getEmail());
        return emailVerifyService.sendEmail(session.getId(),emailRequest);
    }

    @PostMapping("/verify-email")
    public EmailVerifyResponseDTO verifyEmail(HttpSession session,@RequestBody EmailVerificationRequestDTO request) {
        System.out.println("verify Session ID: " + session.getId());

        return emailVerifyService.verifyEmail(session.getId(),request);
     }


}