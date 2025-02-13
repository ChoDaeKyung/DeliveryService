package com.example.selectfront.controller.member;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import util.CookieUtil;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
public class MemberController {
    @Value("${emails-url}")
    private String loginServiceUrl;

    @Value("${swfm.service-url:}")
    private String edgeServiceUrl; // edge-service URL을 로드밸런서로 지정

    @GetMapping("/oauth2/authorization/google")
    public String redirectToEdgeService() {
        String url = edgeServiceUrl + "/oauth2/authorization/google";  // "http://edge-service:80/oauth2/authorization/google"
        // 요청을 edge-service로 전달하거나 리디렉션
        return "redirect:" + url;  // edge-service로 리디렉션
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("loginServiceUrl", loginServiceUrl);
        model.addAttribute("title", "로그인 페이지");

        return "login";
    }
    //비밀번호 재설정
    @GetMapping("/reset-password")
    public String showResetPasswordPage(@RequestParam("token") String token, Model model) {
        model.addAttribute("resetToken", token); // token을 모델에 담아서 전달
        System.out.println("token: " + token);
        return "login"; // reset-password.html로 이동
    }
    //이메일 로그인
    @GetMapping("/login/callback")
    public String loginWithTokens(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 쿠키에서 accessToken과 refreshToken을 읽음
        String accessToken = getCookieValue(request, "accessToken");
        String refreshToken = getCookieValue(request, "refreshToken");
        if (accessToken == null || refreshToken == null) {
            // 토큰이 없으면 로그인 실패 처리 또는 다른 흐름
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing tokens");
            return null;
        }
        CookieUtil.deleteCookie(request,response,"accessToken");
        // 쿠키에서 refreshToken 저장
        System.out.println("access token: " + accessToken);
        System.out.println("refresh token: " + refreshToken);

        // Ensure the access token is properly encoded for JavaScript
        String encodedAccessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8).replace("+", "%20");

        // 응답 문자 인코딩과 콘텐츠 유형 설정
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");

        // 액세스 토큰을 로컬 스토리지에 저장하는 자바스크립트 코드
        String script = "<script>" +
                "window.localStorage.setItem('accessToken', '" + encodedAccessToken + "');" +
                "window.location.href = '/index';" +  // 직접 URL 입력
                "</script>";



        response.getWriter().write(script);  // HTML 내에 자바스크립트를 삽입하여 실행

        return null; // 뷰 리졸버를 통한 리턴을 막고, 직접 응답 처리
    }

    // 쿠키에서 값을 읽는 유틸리티 메서드
    private String getCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals(cookieName)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    @GetMapping("/emailLogin")
    public String emailLogin() {
        return "email_login";
    }
    @GetMapping("/join")
    public String join() {
        return "join";
    }

    @GetMapping("findId")
    public String findId() {
        return "find_id";
    }
    @GetMapping("findPw")
    public String findPw() {
        return "find_pw";
    }
}
