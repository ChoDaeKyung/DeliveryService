package com.example.selectfront.controller.member;

import com.example.selectfront.dto.findMemberResponseDTO;
import com.example.selectfront.dto.member.*;
import com.example.selectfront.service.member.EmailValidationService;
import com.example.selectfront.service.member.EmailVerifyService;
import com.example.selectfront.service.member.MemberFindService;
import com.example.selectfront.service.member.MemberService;
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
    private final EmailValidationService emailValidationService;
    private final MemberFindService memberFindService;

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
        if (userLoginResponseDTO.isLoggedIn()) {
            CookieUtil.addCookie(response,"refreshToken",userLoginResponseDTO.getRefreshToken(),7*24*60*60);
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
      if(emailValidationService.isValidEmail(emailRequest.getEmail())){
            return EmailVerifyResponseDTO.builder().success(false).message("유효한 이메일이 아닙니다!").build();
          };

        System.out.println("Session ID: " + session.getId());

        System.out.println("email: " + emailRequest.getEmail());
        return emailVerifyService.sendEmail(session.getId(),emailRequest);
    }

    @PostMapping("/verify-email")
    public EmailVerifyResponseDTO verifyEmail(HttpSession session,@RequestBody EmailVerificationRequestDTO request) {
        System.out.println("verify Session ID: " + session.getId());

        EmailVerifyResponseDTO emailVerifyResponseDTO = emailVerifyService.verifyEmail(session.getId(), request);
        System.out.println(emailVerifyResponseDTO.getMessage());
        System.out.println(emailVerifyResponseDTO.isSuccess());
        return emailVerifyResponseDTO;
    }
  @PostMapping("/find-id")
    public ResponseEntity<findMemberResponseDTO> findId(@RequestBody EmailRequestDTO emailRequest) {
      System.out.println("email: " + emailRequest.getEmail());
      if(emailValidationService.isValidEmail(emailRequest.getEmail())){
          ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효한 이메일이 아닙니다!");
      };
      findMemberResponseDTO emailVerifyResponseDTO = memberFindService.findId(emailRequest);
       return ResponseEntity.ok(emailVerifyResponseDTO);
    }
    @PostMapping("/claims")
    public ClaimsResponseDTO claims(@RequestBody ClaimsRequestDTO claimsRequestDTO) {
        // 토큰 검증 및 사용자 정보 반환
        System.out.println("token: "+claimsRequestDTO.getToken());
        return memberService.verifyToken(claimsRequestDTO.getToken());
    }

}
