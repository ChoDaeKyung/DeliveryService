package com.example.selectfront.dto.order;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderRequestDTO {
    private String userId;
    private String message;
    private String status;
    private String orderId;
    private String riderId;
}
