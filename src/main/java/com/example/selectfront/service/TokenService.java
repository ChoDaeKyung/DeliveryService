package com.example.selectfront.service;

import com.example.selectfront.client.LoginClient;
import com.example.selectfront.dto.member.RefreshTokenResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final LoginClient loginClient;

    public RefreshTokenResponseDTO getRefreshToken(String refreshToken) {
        return loginClient.refreshTokenUpdate(refreshToken);
    }
}
