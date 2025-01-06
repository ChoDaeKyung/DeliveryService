package com.example.selectfront.dto.community;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewDetailDTO {
    private String title;
    private String content;
    private List<String> img;
}
