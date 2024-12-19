package com.example.selectfront.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class News {
    private Long id;
    private String title;
    private Long authorId;
    private LocalDateTime createdAt;
}
