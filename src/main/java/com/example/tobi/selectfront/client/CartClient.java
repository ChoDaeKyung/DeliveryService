package com.example.tobi.selectfront.client;

import com.example.tobi.selectfront.dto.InsertCartRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "CartClient", url="${swfm.cart-service-url}")
public interface CartClient {
    @PostMapping
    String insertCart(@RequestBody InsertCartRequestDTO insertCartRequestDTO);
}
