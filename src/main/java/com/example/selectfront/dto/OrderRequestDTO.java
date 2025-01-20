package com.example.selectfront.dto;

import lombok.*;

@Getter
@Builder
@ToString
public class OrderRequestDTO {
    private String userId;
    private String message;
    private int price;
    private String status;
    private String orderId;
}
