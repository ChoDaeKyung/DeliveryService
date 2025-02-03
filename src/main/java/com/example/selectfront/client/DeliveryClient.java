package com.example.selectfront.client;


import com.example.selectfront.dto.chat.ChatMessageRequestDTO;
import com.example.selectfront.dto.chat.ChatRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "deliveryClient", url="${swfm.service-url}/chat")
public interface DeliveryClient {

    @PostMapping("/send")
    ResponseEntity<String> chatSend(@RequestBody ChatRequestDTO chatRequestDTO);
    @GetMapping("/messages")
    ResponseEntity<List<Object>> getMessages(@RequestParam String orderId,  @RequestParam Long fromTimestamp);


}
