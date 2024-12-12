package com.example.tobi.selectfront.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetSelectProductResponseDTO {
    private String name;
    private String category;
    private int price;
    private String image;
}
