package com.example.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class UserLoginResponseDTO {
    private boolean loggedIn;
    private String accessToken;
    private String refreshToken;
}
