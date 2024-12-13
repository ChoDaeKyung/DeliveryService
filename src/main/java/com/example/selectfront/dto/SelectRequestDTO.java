package com.example.selectfront.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class SelectRequestDTO {
    private List<ProductRequestDTO> productsList;
    private String completeProduct;
    private int totalPrice;
    private String orderId;
}