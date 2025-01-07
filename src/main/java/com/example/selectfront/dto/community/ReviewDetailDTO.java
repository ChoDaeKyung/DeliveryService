package com.example.selectfront.dto.community;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class ReviewDetailDTO {
    private Long id;
    private String title;
    private String content;
    private String authorId;
    private List<String> img;
    private double rating;
    private Instant createdAt;
}
