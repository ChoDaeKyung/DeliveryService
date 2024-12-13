package com.example.selectfront.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
public class ProductRequestDTO {
    private int orderNumber;
    private String name;
    private String category;
    private int price;
    private String buyer;
}
