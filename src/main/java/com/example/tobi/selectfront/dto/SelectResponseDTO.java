package com.example.tobi.selectfront.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SelectResponseDTO {
    private String product;
    private int price;
    private String img;
}
