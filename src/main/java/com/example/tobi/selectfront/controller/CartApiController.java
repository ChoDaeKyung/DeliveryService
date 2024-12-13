package com.example.tobi.selectfront.controller;

import com.example.tobi.selectfront.dto.InsertCartRequestDTO;
import com.example.tobi.selectfront.dto.SelectRequestDTO;
import com.example.tobi.selectfront.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/cart")
public class CartApiController {

    private final CartService cartService;

    @PostMapping
    public String insertSelect(
            @RequestBody InsertCartRequestDTO insertCartRequestDTO
    ){
        System.out.println("insertCartRequestDTO: " + insertCartRequestDTO);
        return cartService.insertCart(insertCartRequestDTO);
    }
}
