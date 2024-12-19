package com.example.selectfront.client;

import com.example.selectfront.dto.GetDetailProductsDTO;
import com.example.selectfront.dto.GetMenuListResponseDTO;
import com.example.selectfront.dto.GetSelectProductResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "MenuClient", url="${swfm.menu-service-url}")
public interface MenuClient {

    @GetMapping
    List<GetMenuListResponseDTO> getMenuList();

    @GetMapping("/getProducts")
    List<GetDetailProductsDTO> getProductsByCompleteProduct(@RequestParam String name);

}
