package com.example.selectfront.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
public class CartProductResponseDTO {
    private int id;
    private String name;
    private String category;
    private int price;
}
