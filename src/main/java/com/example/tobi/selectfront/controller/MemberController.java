package com.example.tobi.selectfront.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import util.CookieUtil;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
public class MemberController {
    @Value("${custom.login-service-url}")
    private String loginServiceUrl;

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("loginServiceUrl", loginServiceUrl);
        return "login";
    }
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

        // 쿠키에서 refreshToken 저장
        System.out.println("access token: " + accessToken);
        System.out.println("refresh token: " + refreshToken);

        // Ensure the access token is properly encoded for JavaScript
        String encodedAccessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8).replace("+", "%20");
        CookieUtil.deleteCookie(request,response,"accessToken");
        // Set response character encoding to UTF-8
        response.setCharacterEncoding("UTF-8");

        // Store the access token in localStorage using JavaScript
        String script = "window.localStorage.setItem('accessToken', '" + encodedAccessToken + "');";
        response.setContentType("text/html");
        response.getWriter().write("<script>" + script + "</script>");

        return "login"; // Return the login view
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
}
