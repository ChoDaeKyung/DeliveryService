package com.example.paymentservice.controller;


import com.example.paymentservice.dto.OrderRequestDTO;
import com.example.paymentservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderService orderService;

    @PostMapping
    public String CompleteOrder(@RequestBody OrderRequestDTO orderRequestDTO) {
        orderService.CompleteOrder(orderRequestDTO);
        return "상품 주문 성공!!";
    }
}
