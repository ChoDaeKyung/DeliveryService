package com.example.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdatePwTokenRequestDTO {
    private String resetToken;
    private String password;
}
