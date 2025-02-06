package com.example.selectfront.service.community;

import com.example.selectfront.client.NewsClient;
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
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsClient newsClient;

    private String uploadDir;

    public CreateNewsResponseDTO createNews(CreateNewsRequestDTO createNewsRequestDTO, List<MultipartFile> images) {
        // 이미지가 있을 경우만 로그 출력
        if (images != null && !images.isEmpty()) {
            System.out.println("img === " + images);
        } else {
            System.out.println("이미지 없음");
            images = null;
        }

        // FeignClient를 통해 데이터 전송 (이미지가 없으면 null 전달)
        ResponseEntity<CreateNewsResponseDTO> response = newsClient.createNews(
                "",  // 인증 헤더
                createNewsRequestDTO.getTitle(),  // 제목
                createNewsRequestDTO.getContent(),  // 내용
                images  // 이미지 목록
        );
        // 응답이 정상인지 확인 후 반환
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            throw new RuntimeException("뉴스 생성 실패: " + response.getStatusCode());
        }
    }



    public NewsListDTO getNews(int page, int pageSize, String token) {
        return newsClient.getNewsList("Bearer " + token, page, pageSize);
    }

    public NewsDetailDTO getNews(Long id) {
        return newsClient.getNewsDetail("",id);
    }

    public void deleteNews(String token, List<Long> ids) {
        newsClient.deleteNews("Bearer " + token, ids);
    }

    public UpdateNewsDTO updateNews(CreateNewsRequestDTO createNewsRequestDTO,List<MultipartFile> images) {
        System.out.println("타입::" + createNewsRequestDTO.getId().getClass().getName());
        System.out.println("img::: "+images);
        // 이미지가 있을 경우만 로그 출력
        if (images != null && !images.isEmpty()) {
            System.out.println("img === " + images);
        } else {
            System.out.println("이미지 없음");
            images = null;
        }

        ResponseEntity<UpdateNewsDTO> response = newsClient.updateNews(
                "",  // 인증 헤더
                createNewsRequestDTO.getId(),
                createNewsRequestDTO.getTitle(),  // 제목
                createNewsRequestDTO.getContent(),  // 내용
                images  // 이미지 목록
        );
        // 응답이 정상인지 확인 후 반환
        if (response.getStatusCode().is2xxSuccessful()) {
            return response.getBody();
        } else {
            throw new RuntimeException("뉴스 생성 실패: " + response.getStatusCode());
        }
    }


}
