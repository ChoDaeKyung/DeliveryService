package com.example.selectfront.client;

import com.example.selectfront.dto.CompleteCartRequestDTO;
import com.example.selectfront.dto.OrderRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "OrderClient", url = "${swfm.service-url}/payment")
public interface OrderClient {

    @PostMapping
    String completeOrder(@RequestBody OrderRequestDTO requestDTO);

}
