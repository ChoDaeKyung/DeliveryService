package com.example.selectfront.dto.member;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class duplicationCheckResponseDTO {
    private boolean isAvailable;
}
