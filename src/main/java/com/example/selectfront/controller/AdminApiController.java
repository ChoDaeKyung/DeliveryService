package com.example.selectfront.controller;

import com.example.selectfront.dto.AddCompleteProductDetailDto;
import com.example.selectfront.dto.AddCompleteProductRequestDTO;
import com.example.selectfront.dto.AddProductRequestDTO;
import com.example.selectfront.dto.AddSideMenuRequestDTO;
import com.example.selectfront.service.AdminService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/admin")
public class AdminApiController {

    private final AdminService adminService;

    private String uploadDir = System.getProperty("user.dir");

    @PostMapping("/addcompleteproducts")
    public ResponseEntity<String> addcompleteproducts(
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("detail") String detail,
            @RequestParam("productsList") String productsListJson,
            @RequestParam("image") MultipartFile image
    ) throws JsonProcessingException {
        System.out.println("name: " + name);
        System.out.println("price: " + price);
        System.out.println("detail: " + detail);
        System.out.println("productsListJson: " + productsListJson);
        System.out.println("image: " + image.getOriginalFilename());


        if (image.isEmpty()) {
            throw new RuntimeException("No file selected");
        }

        adminService.addCompleteProducts(name, price, detail, productsListJson, image);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/addproduct")
    public ResponseEntity<String> addproduct(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") int price,
            @RequestParam("image") MultipartFile image
    ) throws JsonProcessingException {
        System.out.println("name: " + name);
        System.out.println("category: " + category);
        System.out.println("price: " + price);
        System.out.println("image: " + image.getOriginalFilename());


        if (image.isEmpty()) {
            throw new RuntimeException("No file selected");
        }

        adminService.addProducts(name, category, price, image);
        return ResponseEntity.ok("success");
    }

    @PostMapping("/addsidemenu")
    public ResponseEntity<String> addsidemenu(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") int price,
            @RequestParam("detail") String detail,
            @RequestParam("image") MultipartFile image
    ) throws JsonProcessingException {
        System.out.println("name: " + name);
        System.out.println("category: " + category);
        System.out.println("price: " + price);
        System.out.println("image: " + image.getOriginalFilename());


        if (image.isEmpty()) {
            throw new RuntimeException("No file selected");
        }

        adminService.addSideMenu(name, category, price, detail, image);
        return ResponseEntity.ok("success");
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf(".");
        if (dotIndex > 0) {
            return fileName.substring(dotIndex);  // 예: ".jpg", ".png"
        } else {
            return "";  // 확장자가 없는 경우
        }
    }
}
