package com.example.selectfront.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
public class CompleteCartResponseDTO {
    private int id;
    private String name;
    private int totalPrice;
}
