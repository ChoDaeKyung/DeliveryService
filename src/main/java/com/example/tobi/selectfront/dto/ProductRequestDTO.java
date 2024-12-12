package com.example.tobi.selectfront.dto;

import lombok.Builder;
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
    private String sectionId;
    private String buyer;
}
