package com.example.selectfront.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class Review {
    private Long id; //재료 예정 지금은 아이디로 추가함
    private String title;
    private double rating;
    private String authorId;

}
