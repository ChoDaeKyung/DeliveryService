package com.example.selectfront.service;

import com.example.selectfront.client.MenuClient;
import com.example.selectfront.dto.GetDetailProductsDTO;
import com.example.selectfront.dto.GetMenuListResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuClient menuClient;

    public List<GetMenuListResponseDTO> getMenuList() {
        return menuClient.getMenuList();
    }

    public List<GetDetailProductsDTO> getProductsByCompleteProduct(String name) {
        return menuClient.getProductsByCompleteProduct(name);
    }

}
