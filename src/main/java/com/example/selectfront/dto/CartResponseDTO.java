package com.example.selectfront.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
public class CartResponseDTO {
    private List<CompleteCartResponseDTO> CompleteCartList;
    private List<CartProductResponseDTO> CartProductList;
}
