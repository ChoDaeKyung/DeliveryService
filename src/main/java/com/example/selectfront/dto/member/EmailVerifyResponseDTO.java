package com.example.selectfront.dto.member;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailVerifyResponseDTO {
    private boolean success;
    private String message;
}
