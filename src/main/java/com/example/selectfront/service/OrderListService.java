package com.example.selectfront.service;

import com.example.selectfront.client.OrderListClient;
import com.example.selectfront.dto.order.OrderRequestDTO;
import com.example.selectfront.dto.order.OrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderListService {
    private final OrderListClient orderListClient;

    public String sendMessage(OrderRequestDTO orderRequestDTO) {
        return orderListClient.sendMessage(orderRequestDTO);
    }
    public List<OrderResponseDTO> receiveMessages(String status){
        return orderListClient.receiveMessages(status);
    }
    public List<OrderResponseDTO> receiveOrderIdMessages(String orderId){
        return orderListClient.receiveOrderIdMessages(orderId);
    }
}
