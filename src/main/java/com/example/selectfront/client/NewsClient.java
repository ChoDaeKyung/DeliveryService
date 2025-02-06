package com.example.selectfront.client;

import com.example.selectfront.dto.community.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "newsClient", url = "${swfm.service-url}/news")
public interface NewsClient {

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<CreateNewsResponseDTO> createNews(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart(value = "img",required = false) List<MultipartFile> images
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

    @PostMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<UpdateNewsDTO> updateNews(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("id") Long id,
            @RequestPart("title") String title,  // 제목 받기
            @RequestPart("content") String content,  // 내용 받기
            @RequestPart(value = "img", required = false) List<MultipartFile> images);

}
