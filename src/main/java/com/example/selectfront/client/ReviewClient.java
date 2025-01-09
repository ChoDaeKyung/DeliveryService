package com.example.selectfront.client;

import com.example.selectfront.dto.community.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "reviewClient", url = "${swfm.service-url}/review")
public interface ReviewClient {

    //리뷰 작성
    @PostMapping
    ResponseEntity<CreateReviewResponseDTO> createReview(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateReviewRequestDTO createReviewRequestDTO
    );

    //리뷰 수정
    @PutMapping
    ResponseEntity<CreateReviewResponseDTO> updateReview(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateReviewRequestDTO createReviewRequestDTO
    );

    @GetMapping("/detail")
    ReviewDetailDTO getReviewDetail(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("id") Long id
    );


    @GetMapping
    ReviewListDTO getReviewList(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("page") int page,
            @RequestParam("pageSize") int pageSize
    );

    @GetMapping("/myReview")
    MyReviewListDTO getMyReviewList(
            @RequestHeader("Authorization") String authorization, // JWT 토큰
            @RequestParam String id,
            @RequestParam int page,
            @RequestParam int pageSize);

    @GetMapping("/myReviewList")
    AllMyReviewListDTO getMyReviewAllList(
            @RequestHeader("Authorization") String authorization, // JWT 토큰
            @RequestParam String id,
            @RequestParam int page,
            @RequestParam int pageSize);
}
