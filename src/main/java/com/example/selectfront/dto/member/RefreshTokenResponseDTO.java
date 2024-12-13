package com.example.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RefreshTokenResponseDTO {
    private boolean validated;
    private String access_token;
    private String refresh_token;
}
