package com.example.selectfront.controller;

import com.example.selectfront.dto.OrderRequestDTO;
import com.example.selectfront.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/order")
public class OrderApiController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<String> CompleteOrder(
            @RequestBody OrderRequestDTO orderRequestDTO
    ){
        System.out.println("orderRequestDTO :: " + orderRequestDTO);

        orderService.CompleteOrder(orderRequestDTO);

        return ResponseEntity.ok("success");
    }


}
