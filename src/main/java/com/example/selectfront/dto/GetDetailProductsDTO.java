package com.example.selectfront.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
public class GetDetailProductsDTO {
    private String name;
    private String category;
    private int price;
    private String image;
}
