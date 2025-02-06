package com.example.selectfront.controller.member;

import com.example.selectfront.dto.ClaimsRequestDTO;
import com.example.selectfront.dto.ClaimsResponseDTO;
import com.example.selectfront.dto.findMemberResponseDTO;
import com.example.selectfront.dto.member.*;
import com.example.selectfront.service.member.EmailValidationService;
import com.example.selectfront.service.member.EmailVerifyService;
import com.example.selectfront.service.member.MemberFindService;
import com.example.selectfront.service.member.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import util.CookieUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member/api")
@Slf4j
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
            System.out.println("로그인성공");
            CookieUtil.addCookie(response,"refreshToken",userLoginResponseDTO.getRefreshToken(),7*24*60*60);
            return ResponseEntity.ok(
                    UserLoginResponseDTO.builder()
                            .accessToken(userLoginResponseDTO.getAccessToken())
                            .build()
            );
        } else {
            System.out.println("로그인 실패");
            // 로그인 실패 시 Unauthorized 상태 코드와 함께 실패 응답 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(UserLoginResponseDTO.builder()
                            .accessToken(null) // 로그인 실패 시 Access Token은 null
                            .build());
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
    @Value("${swfm.service-url}")
    private String loginServiceUrl;

    @PostMapping("/server-logout")
    public ResponseEntity<LogoutServerResponseDTO> logout() {
        LogoutServerResponseDTO build = LogoutServerResponseDTO.builder().redirectUrl(loginServiceUrl + "/logout").build();
        return ResponseEntity.ok(build);
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
    @GetMapping("/check-login")
    public ResponseEntity<?> checkLogin(HttpServletRequest request) {
        String refreshToken = CookieUtil.getCookie(request, "refreshToken");
        log.info("refreshToken: {}", refreshToken);

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("RefreshToken not found");
        }

        boolean login = memberService.getLogin(ValidTokenRequestDTO.builder().token(refreshToken).build());
        log.info("login: {}", login);

        if (login) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired refresh token");
        }
    }
}