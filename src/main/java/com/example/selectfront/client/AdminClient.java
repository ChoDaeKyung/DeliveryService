package com.example.selectfront.client;

import com.example.selectfront.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "AdminClient", url="${swfm.service-url}/admin")
public interface AdminClient {
    @PostMapping(value = "/addCompleteProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    String addCompleteProduct(
            @RequestParam("name") String name,
            @RequestParam("price") int price,
            @RequestParam("detail") String detail,
            @RequestParam("productList") String productList,
            @RequestPart("image") MultipartFile image
    );

    @PostMapping("/addProduct")
    String addProduct(@RequestBody AddProductRequestDTO addProductRequestDTO);

    @PostMapping("/addSideMenu")
    String addSideMenu(@RequestBody AddSideMenuRequestDTO addSideMenuRequestDTO);

}
