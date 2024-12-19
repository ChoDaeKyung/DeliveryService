package com.example.selectfront.controller;

import com.example.selectfront.dto.GetDetailProductsDTO;
import com.example.selectfront.dto.GetMenuListResponseDTO;
import com.example.selectfront.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/menu")
public class MenuApiController {

    private final MenuService menuService;

    @GetMapping
    public List<GetMenuListResponseDTO> getMenuList() {
        System.out.println("menuService.getMenuList() : " + menuService.getMenuList());
        return menuService.getMenuList();
    }

    @GetMapping("/getProducts")
    public List<GetDetailProductsDTO> getProductsByCompleteProduct(
            @RequestParam("name") String name
            ) {
        System.out.println("name : " + name);
        System.out.println("menuService.getProductsByCompleteProduct() : " + menuService.getProductsByCompleteProduct(name));
        return menuService.getProductsByCompleteProduct(name);
    }
}
