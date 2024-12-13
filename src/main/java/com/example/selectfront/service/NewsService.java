package com.example.selectfront.service;

import com.example.selectfront.dto.*;
import com.example.selectfront.newsClient.NewsClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsClient newsClient;

    public CreateNewsResponseDTO createNews(String authorizationHeader, CreateNewsRequestDTO createNewsRequestDTO) {

        ResponseEntity<CreateNewsResponseDTO> news = newsClient.createNews(authorizationHeader, createNewsRequestDTO);
        System.out.println(news.getStatusCode());
        System.out.println(news.getBody());
        return news.getBody();
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

    public void updateNews(String authorizationHeader, CreateNewsRequestDTO createNewsRequestDTO) {
        newsClient.updateNews(authorizationHeader, createNewsRequestDTO);
    }


}
