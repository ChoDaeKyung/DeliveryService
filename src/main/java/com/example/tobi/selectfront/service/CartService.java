package com.example.tobi.selectfront.service;

import com.example.tobi.selectfront.client.CartClient;
import com.example.tobi.selectfront.client.SelectClient;
import com.example.tobi.selectfront.dto.InsertCartRequestDTO;
import com.example.tobi.selectfront.dto.SelectRequestDTO;
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
