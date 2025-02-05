package com.example.selectfront.service.member;

import com.example.selectfront.client.LoginClient;
import com.example.selectfront.dto.member.RefreshTokenResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final LoginClient loginClient;

    public RefreshTokenResponseDTO getRefreshToken(String refreshToken) {
        // 1. refreshToken이 비어있지 않은지 확인
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is missing");
        }

        // 2. LoginClient를 호출하여 토큰 갱신
        return loginClient.refreshTokenUpdate(refreshToken);
    }
}
