package com.example.selectfront.service;

import com.example.selectfront.client.OrderListClient;
import com.example.selectfront.dto.order.OrderRequestDTO;
import com.example.selectfront.dto.order.OrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderListService {
    private final OrderListClient orderListClient;

    public String sendMessage(OrderRequestDTO orderRequestDTO) {
        System.out.println(orderRequestDTO);
        return orderListClient.sendMessage(orderRequestDTO);
    }
    public List<OrderResponseDTO> receiveMessages(String role,String userId, String status){
        if(Objects.equals(status, "배달전")){
            return orderListClient.receiveMessages(status);
        }else{
            if(Objects.equals(role, "ROLE_USER")){
                return receiveUserIdMessages(userId,status);
            }else{
                return receiveRiderIdMessages(userId,status);
            }
        }
    }
    public List<OrderResponseDTO> receiveOrderIdMessages(String orderId){
        return orderListClient.receiveOrderIdMessages(orderId);
    }
    public List<OrderResponseDTO> receiveUserIdMessages(String userId,String status){
        return orderListClient.receiveUserIdMessages(userId,status);
    }
    public List<OrderResponseDTO> receiveRiderIdMessages(String userId,String status){
        return orderListClient.receiveRiderIdMessage(userId,status);
    }
    public List<OrderResponseDTO> receiveOrderList(String userId,String role){
            if(Objects.equals(role, "ROLE_USER")){
                return receiveUserId(userId);
            }else{
                return receiveRiderId(userId);
            }
    }
    public List<OrderResponseDTO> receiveUserId(String userId){
        return orderListClient.receiveUserIdMessages(userId);
    }
    public List<OrderResponseDTO> receiveRiderId(String userId){
        return orderListClient.receiveRiderIdMessage(userId);
    }

}
