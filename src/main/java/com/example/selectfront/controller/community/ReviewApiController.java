package com.example.selectfront.controller.community;

import com.example.selectfront.domain.Review;
import com.example.selectfront.dto.community.*;
import com.example.selectfront.service.community.NewsService;
import com.example.selectfront.service.community.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart(value = "images", required = false) List<MultipartFile> images, // images는 선택적으로 받음
            @RequestParam("rating") double rating,
            @RequestPart("userId") String userId,
            @RequestPart("orderId") String orderId,
            @RequestPart("productName") String productName

    ) {
        System.out.println("title : " + title);
        System.out.println("content : " + content);
        System.out.println("images : " + images);
        System.out.println("rating : " + rating);
        System.out.println("userId : " + userId);
        System.out.println("orderId : " + orderId);
        System.out.println("productName : " + productName);
        // images가 null인 경우 빈 리스트로 처리
        if (images == null) {
            images = new ArrayList<>();
        }

        CreateReviewRequestDTO requestDTO = new CreateReviewRequestDTO();
        requestDTO.setTitle(title);
        requestDTO.setContent(content);
        requestDTO.setRating(rating);
        requestDTO.setAuthorId(userId);
        requestDTO.setOrderId(orderId);
        requestDTO.setProductName(productName);

        // 리뷰 생성 서비스 호출
        return ResponseEntity.ok(reviewService.createReview(requestDTO, images));
    }

    @GetMapping
    public ResponseEntity<?> getReview(@RequestParam int page, @RequestParam int pageSize,
                                       @RequestHeader("Authorization") String authorizationHeader) {
        // "Bearer " 부분을 제거
        String token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;

        System.out.println("review " + page + " " + pageSize + " " + token);
        try {
            ReviewListDTO reviewList = reviewService.getReview(page, pageSize, token);
            System.out.println("reviewList.getReviewList() :: " + reviewList.getReviewList());
            return ResponseEntity.ok(reviewList); // JSON 응답 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching reviews");
        }
    }

    //리뷰 상세
    @GetMapping("/detail")
    public ResponseEntity<?> getReview(@RequestParam Long id) {
        try {
            ReviewDetailDTO ReviewList = reviewService.getReview(id);
            return ResponseEntity.ok(ReviewList); // JSON 응답 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching news");
        }
    }

    //작성 가능한 리뷰 리스트
    @GetMapping("/myList")
    public ResponseEntity<?> getNews(@RequestParam int page, @RequestParam int pageSize,@RequestParam String id, String token ) {
        try {
            MyReviewListDTO myReviewListDTO = reviewService.getMyReview(page, pageSize,id,token);
            System.out.println("myReviewListDTO는 이렇습니다 :: " + myReviewListDTO);
            return ResponseEntity.ok(myReviewListDTO); // JSON 응답 반환
        } catch (Exception e) {
            System.out.println("오류입니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching My Review");
        }
    }

    //작성한 리뷰 리스트
    @GetMapping("/myReviewList")
    public ResponseEntity<?> getMyReviewList(@RequestParam int page, @RequestParam int pageSize,@RequestParam String id, String token ) {
        try {
            AllMyReviewListDTO myReviewListDTO = reviewService.getMyReviewList(page, pageSize,id,token);
            System.out.println("myReviewListDTO는 이렇습니다 :: " + myReviewListDTO);
            return ResponseEntity.ok(myReviewListDTO); // JSON 응답 반환
        } catch (Exception e) {
            System.out.println("오류입니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching My Review");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteReview(
            @RequestHeader("Authorization") String token,
            @RequestBody Long id) {
        reviewService.deleteReview(token, id);
        return ResponseEntity.ok("선택한 뉴스가 삭제되었습니다.");
    }

}
