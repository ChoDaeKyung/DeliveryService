package com.example.selectfront.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class CreateNewsRequestDTO {
    private Long id;
    private String title;
    private String content;
    private Integer authorId;
    private String img;
    private Instant createdAt;
}
