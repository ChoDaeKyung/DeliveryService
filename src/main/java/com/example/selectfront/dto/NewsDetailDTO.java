package com.example.selectfront.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class NewsDetailDTO {

    private String title;
    private String content;
    private List<String> img;
}
