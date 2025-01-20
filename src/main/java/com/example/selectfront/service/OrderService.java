package com.example.selectfront.service;

import com.example.selectfront.client.OrderClient;
import com.example.selectfront.dto.OrderRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderClient orderClient;

    public String CompleteOrder(OrderRequestDTO orderRequestDTO) {
        return orderClient.completeOrder(orderRequestDTO);
    }

}
