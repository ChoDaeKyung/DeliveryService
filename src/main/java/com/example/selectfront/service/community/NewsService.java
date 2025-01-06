package com.example.selectfront.service.community;

import com.example.selectfront.client.NewsClient;
import com.example.selectfront.dto.community.CreateNewsRequestDTO;
import com.example.selectfront.dto.community.CreateNewsResponseDTO;
import com.example.selectfront.dto.community.NewsDetailDTO;
import com.example.selectfront.dto.community.NewsListDTO;
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
public class NewsService {

    private final NewsClient newsClient;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public CreateNewsResponseDTO createNews(CreateNewsRequestDTO createNewsRequestDTO, List<MultipartFile> images) {
        // 이미지 업로드 처리
        String imgPaths = uploadImages(images);
        createNewsRequestDTO.setImg(imgPaths);
        System.out.println("img"+createNewsRequestDTO.getImg());
        ResponseEntity<CreateNewsResponseDTO> response = newsClient.createNews("",createNewsRequestDTO);
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



    public NewsListDTO getNews(int page, int pageSize, String token) {
        return newsClient.getNewsList("Bearer " + token, page, pageSize);
    }

    public NewsDetailDTO getNews(Long id) {
        return newsClient.getNewsDetail("",id);
    }

    public void deleteNews(String token, List<Long> ids) {
        newsClient.deleteNews("Bearer " + token, ids);
    }

    public CreateNewsResponseDTO updateNews(CreateNewsRequestDTO createNewsRequestDTO, List<MultipartFile> images) {
        String imgPaths = uploadImages(images);
        createNewsRequestDTO.setImg(imgPaths);
        System.out.println("img"+createNewsRequestDTO.getImg());
        ResponseEntity<CreateNewsResponseDTO> response = newsClient.updateNews("",createNewsRequestDTO);
        return response.getBody();
    }


}
