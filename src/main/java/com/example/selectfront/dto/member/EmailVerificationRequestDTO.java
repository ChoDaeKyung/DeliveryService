package com.example.selectfront.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerificationRequestDTO {
    private String verificationCode;
}
