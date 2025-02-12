package com.example.selectfront.controller;

import com.example.selectfront.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @GetMapping("/success")
    public String handleSuccess(
            @RequestParam String paymentKey,
            @RequestParam String orderId,
            @RequestParam String amount
    ) {
        System.out.println("paymentKey is :: " + paymentKey);
        System.out.println("orderId is :: " + orderId);
        System.out.println("amount is :: " + amount);

        orderService.CompleteOrder(paymentKey, orderId, amount);
        return "mypage";
    }
}
