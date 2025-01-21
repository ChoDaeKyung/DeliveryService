package com.example.selectfront.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class OrderListController {
    @GetMapping("/chat")
    public String chat(@RequestParam(required = false) String orderId, Model model) {

        model.addAttribute("orderId", orderId);
        return "chat_delivery";
    }

    @GetMapping("/order")
    public String menu( ) {

        return "orderList";
    }

}
