package com.example.selectfront.client;

import com.example.selectfront.dto.GetDetailProductsDTO;
import com.example.selectfront.dto.GetCompleteProductsListResponseDTO;
import com.example.selectfront.dto.GetMenuListResponseDTO;
import com.example.selectfront.dto.GetSideMenuListResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "MenuClient", url="${swfm.service-url}/menu")
public interface MenuClient {

    @GetMapping
    GetMenuListResponseDTO getMenuList();

    @GetMapping("/getProducts")
    List<GetDetailProductsDTO> getProductsByCompleteProduct(@RequestParam String name);

    @GetMapping("/getMenuListByName")
    GetCompleteProductsListResponseDTO getMenuListByName(@RequestParam String name);

    @GetMapping("/getSideMenuByCategory")
    List<GetSideMenuListResponseDTO> getSideMenuByCategory(@RequestParam String category);

}
