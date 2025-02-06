package com.example.selectfront.service.community;

import com.example.selectfront.client.ReviewClient;
import com.example.selectfront.dto.community.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewClient reviewClient;


    public CreateReviewResponseDTO createReview(CreateReviewRequestDTO createReviewRequestDTO, List<MultipartFile> images) {
        // 이미지 업로드 처리
        if (images != null && !images.isEmpty()) {
            System.out.println("img === " + images);
        } else {
            System.out.println("이미지 없음");
            images = null;
        }

        // FeignClient를 통해 데이터 전송 (이미지가 없으면 null 전달)
        ResponseEntity<CreateReviewResponseDTO> response = reviewClient.createReview(
                "",  // 인증 헤더
                createReviewRequestDTO.getTitle(),  // 제목
                createReviewRequestDTO.getContent(),  // 내용
                createReviewRequestDTO.getRating(),
                createReviewRequestDTO.getAuthorId(),
                createReviewRequestDTO.getOrderId(),
                createReviewRequestDTO.getProductName(),
                images  // 이미지 목록
        );
        // 응답이 정상인지 확인 후 반환
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            throw new RuntimeException("뉴스 생성 실패: " + response.getStatusCode());
        }
    }

    public ReviewDetailDTO getReview(Long id) {
        return reviewClient.getReviewDetail("",id);
    }

    public ReviewListDTO getReview(int page, int pageSize, String token) {
        return reviewClient.getReviewList("Bearer " + token, page, pageSize);
    }

    //작성 가능한 리뷰
    public MyReviewListDTO getMyReview(int page, int pageSize, String id, String token) {
        return reviewClient.getMyReviewList("Bearer " + token, id, page, pageSize);
    }

    //작성한 리뷰
    public AllMyReviewListDTO getMyReviewList(int page, int pageSize, String id, String token) {
        return reviewClient.getMyReviewAllList("Bearer " + token, id, page, pageSize);
    }

    public void deleteReview(String token, Long id) {
        reviewClient.deleteReview("Bearer " + token, id);
    }
}
