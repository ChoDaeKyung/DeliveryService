package com.example.selectfront.service;

import com.example.selectfront.client.MenuClient;
import com.example.selectfront.dto.GetDetailProductsDTO;
import com.example.selectfront.dto.GetCompleteProductsListResponseDTO;
import com.example.selectfront.dto.GetMenuListResponseDTO;
import com.example.selectfront.dto.GetSideMenuListResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuClient menuClient;

    public GetMenuListResponseDTO getMenuList() {
        return menuClient.getMenuList();
    }

    public List<GetDetailProductsDTO> getProductsByCompleteProduct(String name) {
        return menuClient.getProductsByCompleteProduct(name);
    }

    public GetCompleteProductsListResponseDTO getMenuListByName(String name) {
        return menuClient.getMenuListByName(name);
    }

    public List<GetSideMenuListResponseDTO> getSideMenuByCategory(String category) {
        return menuClient.getSideMenuByCategory(category);
    }

}
