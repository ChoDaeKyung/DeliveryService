package com.example.selectfront.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NewsListDTO {
    private List<com.example.selectfront.domain.News> newsList; // 뉴스 리스트
    private int newsNum;         // 전체 뉴스 개수
    private int allPage;         // 총 페이지 수
    private int pageSize;        // 페이지당 뉴스 수
    private int page;            // 현재 페이지
}

