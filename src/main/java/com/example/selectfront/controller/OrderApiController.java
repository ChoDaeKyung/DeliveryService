package com.example.selectfront.controller;

import com.example.selectfront.dto.order.OrderRequestDTO;
import com.example.selectfront.dto.order.OrderResponseDTO;
import com.example.selectfront.service.OrderListService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orderList")
public class OrderApiController {
    private final OrderListService orderListService;

    @PostMapping("/orderSend")
    public String sendMessage(@RequestBody OrderRequestDTO orderRequestDTO) {
        return orderListService.sendMessage(orderRequestDTO);
    }
    @GetMapping("/receiveStatus")
    public List<OrderResponseDTO> receiveMessages(@RequestParam String role,
                                                  @RequestParam String userId,
                                                  @RequestParam String status) {

        return orderListService.receiveMessages(role,userId,status);
    }
    @GetMapping("/receiveOrderIdMessages")
    public List<OrderResponseDTO> receiveOrderIdMessages(String orderId) {
        return orderListService.receiveOrderIdMessages(orderId);
    }

    @GetMapping("/orderList")
    public List<OrderResponseDTO> orderLists(@RequestParam String userId , @RequestParam String role) {
        List<OrderResponseDTO> orderResponseDTOS = orderListService.receiveOrderList(userId, role);
        for (OrderResponseDTO orderResponseDTO : orderResponseDTOS) {
            System.out.println("orderList"+orderResponseDTO);
        }
        System.out.println("orderLists"+orderResponseDTOS.getFirst());
        return orderResponseDTOS;
    }
}
