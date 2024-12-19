package com.example.selectfront.service;

import com.example.selectfront.client.AdminClient;
import com.example.selectfront.client.SelectClient;
import com.example.selectfront.dto.AddCompleteProductRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminClient adminClient;

    public String addCompleteProducts(AddCompleteProductRequestDTO addCompleteProductRequestDTO) {
        System.out.println("addCompleteProductRequestDTO :: " + addCompleteProductRequestDTO);
        return adminClient.addCompleteProduct(addCompleteProductRequestDTO);
    }
}
