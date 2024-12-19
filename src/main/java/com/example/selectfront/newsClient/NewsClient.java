package com.example.selectfront.newsClient;

import com.example.selectfront.dto.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "newsClient", url = "${swfm.news-list-service}")
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
    ResponseEntity<?> updateNews(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateNewsRequestDTO createNewsRequestDTO
    );

}