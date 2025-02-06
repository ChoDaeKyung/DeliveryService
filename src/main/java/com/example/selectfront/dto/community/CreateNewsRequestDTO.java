package com.example.selectfront.dto.community;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@ToString
public class CreateNewsRequestDTO {
    private Long id;
    private String title;
    private String content;
    private Integer authorId;
    private Instant createdAt;
    private String img;
}
