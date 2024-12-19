package com.example.selectfront.client;

import com.example.selectfront.dto.CartResponseDTO;
import com.example.selectfront.dto.CompleteCartRequestDTO;
import com.example.selectfront.dto.InsertCartRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "CartClient", url="${swfm.cart-service-url}")
public interface CartClient {
    @PostMapping
    String insertCart(@RequestBody InsertCartRequestDTO insertCartRequestDTO);

    @PostMapping("/completeProduct")
    String insertCompleteProductToCart(@RequestBody CompleteCartRequestDTO completeCartRequestDTO);

    @GetMapping("/getCartList")
    CartResponseDTO getCartList(@RequestParam String nickName);
}
