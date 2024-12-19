package com.example.selectfront.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetConfirmDTO {
    private String resetToken;
    private String newPassword;
}
