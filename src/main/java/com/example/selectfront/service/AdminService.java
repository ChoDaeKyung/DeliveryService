package com.example.selectfront.service;

import com.example.selectfront.client.AdminClient;
import com.example.selectfront.client.SelectClient;
import com.example.selectfront.dto.AddCompleteProductDetailDto;
import com.example.selectfront.dto.AddCompleteProductRequestDTO;
import com.example.selectfront.dto.AddProductRequestDTO;
import com.example.selectfront.dto.AddSideMenuRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminClient adminClient;

    public String addCompleteProducts(String name, int price, String detail, String productsList, MultipartFile image) {
        return adminClient.addCompleteProduct(name, price, detail, productsList, image);
    }

    public String addProducts(String name, String category, int price, MultipartFile image) {
        return adminClient.addProduct(name, category, price, image);
    }

    public String addSideMenu(String name, String category, int price, String detail, MultipartFile image) {
        return adminClient.addSideMenu(name, category, price, detail, image);
    }
}

