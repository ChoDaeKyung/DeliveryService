package com.example.selectfront.dto.community;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class CreateReviewRequestDTO {

    private Long id;
    private String title;
    private String content;
    private String authorId;
    private String img;
    private double rating;
    private Instant createdAt;
    private String orderId;
    private String productName;
}
