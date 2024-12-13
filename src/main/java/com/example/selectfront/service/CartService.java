package com.example.selectfront.service;

import com.example.selectfront.client.CartClient;
import com.example.selectfront.dto.InsertCartRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartClient cartClient;

    public String insertCart(InsertCartRequestDTO insertCartRequestDTO) {
        return cartClient.insertCart(insertCartRequestDTO);
    }

}
