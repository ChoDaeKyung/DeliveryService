package com.example.selectfront.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class AddProductRequestDTO {
    private String name;
    private String category;
    private int price;
    private String imagePath;
}