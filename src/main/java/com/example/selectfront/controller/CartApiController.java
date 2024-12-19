package com.example.selectfront.controller;

import com.example.selectfront.dto.CartResponseDTO;
import com.example.selectfront.dto.CompleteCartRequestDTO;
import com.example.selectfront.dto.InsertCartRequestDTO;
import com.example.selectfront.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/cart")
public class CartApiController {

    private final CartService cartService;

    @PostMapping
    public String insertSelect(
            @RequestBody InsertCartRequestDTO insertCartRequestDTO
    ) {
        return cartService.insertCart(insertCartRequestDTO);
    }

    @PostMapping("/completeProduct")
    public ResponseEntity<String> insertCompleteProductToCart(
            @RequestBody CompleteCartRequestDTO completeCartRequestDTO
            ){
        System.out.println("completeCartRequestDTO: " + completeCartRequestDTO);
        cartService.insertCompleteProductToCart(completeCartRequestDTO);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/getCartList")
    public CartResponseDTO getCartList(
            @RequestParam String nickName
    ){
        System.out.println("nickName: " + nickName);
        System.out.println("cartService.getCartList(nickName) : " + cartService.getCartList(nickName));
        return cartService.getCartList(nickName);
    }
}

