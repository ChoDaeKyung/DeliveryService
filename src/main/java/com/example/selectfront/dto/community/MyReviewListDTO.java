package com.example.selectfront.dto.community;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class MyReviewListDTO {
    private List<MyReviewOrderIdListDTO> myReviewOrderIdList ;
    private int newsNum;         // 전체 리뷰 개수
    private int allPage;         // 총 페이지 수
    private int pageSize;        // 페이지당 리뷰 수
    private int page;
}
