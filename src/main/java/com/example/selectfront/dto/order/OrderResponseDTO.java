package com.example.selectfront.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class OrderResponseDTO {
    private String status;
    private String orderId;
    private String messageBody;
    private String userId;
    private String riderId;

}
