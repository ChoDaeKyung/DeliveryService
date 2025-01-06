package com.example.selectfront.client;

import com.example.selectfront.dto.order.OrderRequestDTO;
import com.example.selectfront.dto.order.OrderResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "OrderListClient", url="${swfm.service-url}/order")
public interface OrderListClient {

    @PostMapping("/send")
    String sendMessage(@RequestBody OrderRequestDTO orderRequestDTO);

    @GetMapping("/receive")
    List<OrderResponseDTO> receiveMessages(@RequestParam String status);

    @GetMapping("/orderId")
    List<OrderResponseDTO> receiveOrderIdMessages(@RequestParam String orderId);
}
