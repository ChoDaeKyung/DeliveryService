package com.example.selectfront.client;

import com.example.selectfront.dto.community.CreateNewsRequestDTO;
import com.example.selectfront.dto.community.CreateNewsResponseDTO;
import com.example.selectfront.dto.community.NewsDetailDTO;
import com.example.selectfront.dto.community.NewsListDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "newsClient", url = "${swfm.service-url}/news")
public interface NewsClient {

    @PostMapping
    ResponseEntity<CreateNewsResponseDTO> createNews(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateNewsRequestDTO createNewsRequestDTO
    );

    @GetMapping
    NewsListDTO getNewsList(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("page") int page,
            @RequestParam("pageSize") int pageSize
    );

    @GetMapping("/detail")
    NewsDetailDTO getNewsDetail(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("id") Long id
    );

    @DeleteMapping
    ResponseEntity<?> deleteNews(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody List<Long> ids
    );

    @PutMapping
    ResponseEntity<CreateNewsResponseDTO> updateNews(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateNewsRequestDTO createNewsRequestDTO
    );

}
