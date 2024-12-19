package com.example.selectfront.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class CompleteCartRequestDTO {
    private String name;
    private int price;
    private String buyer;
    private String productId;
}
