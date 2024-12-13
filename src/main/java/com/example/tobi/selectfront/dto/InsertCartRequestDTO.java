package com.example.tobi.selectfront.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class InsertCartRequestDTO {
    private List<CartProductRequestDTO> productsList;
    private String name;
    private int totalPrice;
    private String buyer;
    private String productId;
}
