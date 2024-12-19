package com.example.selectfront.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class AddCompleteProductDetailDto {
    private String name;
    private String category;
    private String price;
}
