package com.example.selectfront.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class CustomProductsRequestDTO {
    private int id; // 추가된 필드
    private String name;
    private String category;
    private int price;
    private String buyer;
}
