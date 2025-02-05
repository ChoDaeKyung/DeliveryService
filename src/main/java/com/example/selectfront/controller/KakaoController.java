package com.example.selectfront.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KakaoController {

    @Value("${kakao.api-key}")
    private String kakaoApiKey;

    @GetMapping("/getKakaoApiKey")
    public String getKakaoApiKey() {
        return kakaoApiKey;
    }
}
