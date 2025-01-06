package com.example.selectfront.controller.community;

import com.example.selectfront.dto.community.CreateNewsRequestDTO;
import com.example.selectfront.dto.community.CreateNewsResponseDTO;
import com.example.selectfront.dto.community.NewsDetailDTO;
import com.example.selectfront.dto.community.NewsListDTO;
import com.example.selectfront.service.community.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/news")
public class NewsCreateApiController {

    private final NewsService newsService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateNewsResponseDTO> createNews(
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart(value = "images", required = false) List<MultipartFile> images // images는 선택적으로 받음
    ) {
        // images가 null인 경우 빈 리스트로 처리
        if (images == null) {
            images = new ArrayList<>();
        }

        CreateNewsRequestDTO requestDTO = new CreateNewsRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);

        // 뉴스 생성 서비스 호출
        return ResponseEntity.ok(newsService.createNews(requestDTO, images));
    }


    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateNewsResponseDTO> updateNews(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam("postId") Long postId
    ) {
        // images가 null인 경우 빈 리스트로 처리
        if (images == null) {
            images = new ArrayList<>();
        }

        CreateNewsRequestDTO requestDTO = new CreateNewsRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);
        requestDTO.setId(postId);

        // 뉴스 수정 서비스 호출
        return ResponseEntity.ok(newsService.updateNews(requestDTO, images));
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



}
