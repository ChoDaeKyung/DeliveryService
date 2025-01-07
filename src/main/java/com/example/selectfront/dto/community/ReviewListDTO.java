package com.example.selectfront.dto.community;

import com.example.selectfront.domain.News;
import com.example.selectfront.domain.Review;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewListDTO {
    private List<Review> reviewList; // 리뷰 리스트
    private int newsNum;         // 전체 리뷰 개수
    private int allPage;         // 총 페이지 수
    private int pageSize;        // 페이지당 리뷰 수
    private int page;
}
