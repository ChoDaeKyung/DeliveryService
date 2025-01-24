package com.example.selectfront.service;

import com.example.selectfront.client.OrderClient;
import com.example.selectfront.dto.OrderRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderClient orderClient;

    public String CompleteOrder(String paymentKey,String orderId,String amount) {
        OrderRequestDTO build = OrderRequestDTO.builder()
                .paymentKey(paymentKey)
                .orderId(orderId)
                .amount(amount)
                .build();
        return orderClient.completeOrder(build);
    }

}
