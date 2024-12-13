package com.example.selectfront.controller;

import com.example.selectfront.dto.*;
import com.example.selectfront.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/news")
public class NewsCreateApiController {

    private final NewsService newsService;

    @PostMapping
    public CreateNewsResponseDTO createNews(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @RequestBody CreateNewsRequestDTO createNewsRequestDTO
    ) {
        System.out.println("createNewsRequestDTO : " + createNewsRequestDTO);
        return newsService.createNews(authorizationHeader, createNewsRequestDTO);
    }

    @GetMapping
    public ResponseEntity<?> getNews(@RequestParam int page, @RequestParam int pageSize,String token) {
        try {
            NewsListDTO newsList = newsService.getNews(page, pageSize,token);
            return ResponseEntity.ok(newsList); // JSON 응답 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching news");
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<?> getNews(@RequestParam Long id) {
        try {
            NewsDetailDTO newsList = newsService.getNews(id);
            return ResponseEntity.ok(newsList); // JSON 응답 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching news");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteNews(
            @RequestHeader("Authorization") String token,
            @RequestBody List<Long> ids) {
        newsService.deleteNews(token, ids);
        return ResponseEntity.ok("선택한 뉴스가 삭제되었습니다.");
    }

    @PutMapping
    public ResponseEntity<?> updateNews(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @RequestBody CreateNewsRequestDTO createNewsRequestDTO
    ) {
        try {
            newsService.updateNews(authorizationHeader, createNewsRequestDTO);
            return ResponseEntity.ok().body(new HashMap<String, String>() {{
                put("message", "수정 완료~");
            }}); // JSON 응답 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<String, String>() {{
                put("error", "Error updating news");
            }}); // JSON 응답 반환
        }

    }

}
