package com.example.tobi.selectfront.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class CartProductRequestDTO {
    private int id;
    private String name;
    private String category;
    private int price;
    private String buyer;
}
