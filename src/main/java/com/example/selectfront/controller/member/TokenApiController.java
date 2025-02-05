package com.example.selectfront.controller.member;

import com.example.selectfront.dto.member.RefreshTokenResponseDTO;
import com.example.selectfront.service.member.TokenService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.CookieUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class TokenApiController {

    private final TokenService tokenService;

    @PostMapping("/refresh-token")
    public ResponseEntity<String> refreshToken(
            HttpServletResponse response,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        // 1. Authorization 헤더가 비어있거나 "Bearer "가 없는 경우 처리
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // 2. "Bearer " 제거하고 순수 토큰 값 추출
        String refreshToken = authorizationHeader.substring(7).trim();

        // 3. TokenService를 통해 리프레시 토큰 갱신
        RefreshTokenResponseDTO refreshTokenResponse = tokenService.getRefreshToken(refreshToken);

        // 4. 토큰 검증 후 처리
        if (refreshTokenResponse.isValidated()) {
            CookieUtil.addCookie(response, "refreshToken", refreshTokenResponse.getRefresh_token(), 7 * 24 * 60 * 60);
            return ResponseEntity.ok(refreshTokenResponse.getAccess_token());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}
