package com.example.selectfront.client;

import com.example.selectfront.dto.community.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "reviewClient", url = "${swfm.service-url}/review")
public interface ReviewClient {

    //리뷰 작성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<CreateReviewResponseDTO> createReview(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestParam("rating") double rating,
            @RequestPart("userId") String userId,
            @RequestPart("orderId") String orderId,
            @RequestPart("productName") String productName,
            @RequestPart(value = "images", required = false) List<MultipartFile> images // images는 선택적으로 받음
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

    @DeleteMapping
    ResponseEntity<?> deleteReview(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Long id
    );
}
