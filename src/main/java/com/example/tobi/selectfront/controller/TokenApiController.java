package com.example.tobi.selectfront.controller;

import com.example.tobi.selectfront.client.LoginClient;
import com.example.tobi.selectfront.dto.member.RefreshTokenResponseDTO;
import com.example.tobi.selectfront.service.TokenService;
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
    public ResponseEntity<String> refreshToken(HttpServletResponse response, @RequestHeader("Authorization") String refreshToken) {
        RefreshTokenResponseDTO refreshToken1 = tokenService.getRefreshToken(refreshToken);
        if(refreshToken1.isValidated()) {
            CookieUtil.addCookie(response,"refreshToken",refreshToken1.getRefresh_token(),7*24*60*60);
            return ResponseEntity.ok(refreshToken1.getAccess_token());
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
