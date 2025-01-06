package com.example.selectfront.controller.community;

import com.example.selectfront.dto.community.CreateNewsRequestDTO;
import com.example.selectfront.dto.community.CreateNewsResponseDTO;
import com.example.selectfront.dto.community.CreateReviewRequestDTO;
import com.example.selectfront.dto.community.CreateReviewResponseDTO;
import com.example.selectfront.service.community.NewsService;
import com.example.selectfront.service.community.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/review")
public class ReviewApiController {

    private final ReviewService reviewService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateReviewResponseDTO> createReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images, // images는 선택적으로 받음
            @RequestParam("rating") double rating,
            @RequestParam("userId") String userId
    ) {
        System.out.println("title : " + title);
        System.out.println("content : " + content);
        System.out.println("images : " + images);
        System.out.println("rating : " + rating);
        System.out.println("userId : " + userId);
        // images가 null인 경우 빈 리스트로 처리
        if (images == null) {
            images = new ArrayList<>();
        }

        CreateReviewRequestDTO requestDTO = new CreateReviewRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);
        requestDTO.setRating(rating);
        requestDTO.setAuthorId(userId);

        // 리뷰 생성 서비스 호출
        return ResponseEntity.ok(reviewService.createReview(requestDTO, images));
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateReviewResponseDTO> updateReview(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam("rating") double rating,
            @RequestParam("postId") Long postId
    ) {
        // images가 null인 경우 빈 리스트로 처리
        if (images == null) {
            images = new ArrayList<>();
        }

        CreateReviewRequestDTO requestDTO = new CreateReviewRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);
        requestDTO.setRating(rating);
        requestDTO.setId(postId);

        // 리뷰 수정 서비스 호출
        return ResponseEntity.ok(reviewService.updateReview(requestDTO, images));
    }

}
