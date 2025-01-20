package com.example.paymentservice.dto;

import lombok.*;

@Getter
@Builder
@ToString
@NoArgsConstructor // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 포함한 생성자 추가
public class OrderRequestDTO {
    private String userId;
    private String message;
    private int price;
    private String status;
    private String orderId;
}
