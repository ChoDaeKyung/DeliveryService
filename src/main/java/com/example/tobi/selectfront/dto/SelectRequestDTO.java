package com.example.tobi.selectfront.dto;

import lombok.*;

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