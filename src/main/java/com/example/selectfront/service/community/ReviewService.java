package com.example.selectfront.service.community;

import com.example.selectfront.client.NewsClient;
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

    @Value("${file.upload-dir}")
    private String uploadDir;

    public CreateReviewResponseDTO createReview(CreateReviewRequestDTO createReviewRequestDTO, List<MultipartFile> images) {
        // 이미지 업로드 처리
        String imgPaths = uploadImages(images);
        createReviewRequestDTO.setImg(imgPaths);
        System.out.println("img"+createReviewRequestDTO.getImg());
        ResponseEntity<CreateReviewResponseDTO> response = reviewClient.createReview("",createReviewRequestDTO);
        return response.getBody();
    }

    private String uploadImages(List<MultipartFile> images) {
        List<String> paths = new ArrayList<>();

        for (MultipartFile image : images) {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            try {
                Files.copy(image.getInputStream(), filePath);
                paths.add(filePath.toString());
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 실패: " + fileName, e);
            }
        }

        return String.join(";", paths); // 경로를 구분자로 연결
    }

    public CreateReviewResponseDTO updateReview(CreateReviewRequestDTO createReviewRequestDTO, List<MultipartFile> images) {
        String imgPaths = uploadImages(images);
        createReviewRequestDTO.setImg(imgPaths);
        System.out.println("img"+createReviewRequestDTO.getImg());
        ResponseEntity<CreateReviewResponseDTO> response = reviewClient.updateReview("",createReviewRequestDTO);
        return response.getBody();
    }

    public ReviewDetailDTO getReview(Long id) {
        return reviewClient.getReviewDetail("",id);
    }

    public ReviewListDTO getReview(int page, int pageSize, String token) {
        return reviewClient.getReviewList("Bearer " + token, page, pageSize);
    }

}
