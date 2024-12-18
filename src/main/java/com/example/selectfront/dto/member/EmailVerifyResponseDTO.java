package com.example.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EmailVerifyResponseDTO {
    private boolean success;
    private String message;
}
