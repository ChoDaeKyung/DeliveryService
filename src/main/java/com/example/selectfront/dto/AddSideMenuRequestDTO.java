package com.example.selectfront.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class AddSideMenuRequestDTO {
    private String name;
    private String category;
    private int price;
    private String detail;
    private String imagePath;
}
