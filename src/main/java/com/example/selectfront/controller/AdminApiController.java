package com.example.selectfront.controller;

import com.example.selectfront.dto.AddCompleteProductDetailDto;
import com.example.selectfront.dto.AddCompleteProductRequestDTO;
import com.example.selectfront.dto.ProductRequestDTO;
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

    @Value("${file.upload-dir}")
    private String uploadDir;

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


        // 파일 확장자 추출 (예: ".jpg", ".png")
        String fileExtension = getFileExtension(image.getOriginalFilename());

        // 새로운 파일 이름 설정 (name 값 + 확장자)
        String fileName = name + fileExtension;

        // 저장할 파일 경로 설정
        Path path = Paths.get(uploadDir + "/" + fileName);

        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        try {
            image.transferTo(path.toFile());
            System.out.println("File saved to: " + path.toString());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to store file");
        }

        System.out.println("File path: " + path.toString());

        List<AddCompleteProductDetailDto> productsList = new ObjectMapper().readValue(productsListJson, new TypeReference<List<AddCompleteProductDetailDto>>() {});

        AddCompleteProductRequestDTO.AddCompleteProductRequestDTOBuilder addCompleteProductRequestDTOBuilder = AddCompleteProductRequestDTO.builder()
                .completeName(name)
                .productsList(productsList)
                .price(price)
                .detail(detail)
                .imagePath(path.toString());

        System.out.println(addCompleteProductRequestDTOBuilder);

        adminService.addCompleteProducts(addCompleteProductRequestDTOBuilder.build());
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
