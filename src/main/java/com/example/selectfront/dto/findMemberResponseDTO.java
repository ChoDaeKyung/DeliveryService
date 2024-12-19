package com.example.selectfront.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class findMemberResponseDTO {
    private boolean success;
    private String message;
}
