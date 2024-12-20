package com.example.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LogoutServerResponseDTO {
    private String redirectUrl;

}
