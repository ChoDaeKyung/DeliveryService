package com.example.tobi.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LogoutResponseDTO {
    private String url;
    private String message;
}
