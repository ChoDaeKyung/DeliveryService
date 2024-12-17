package com.example.selectfront.controller;

import com.example.selectfront.dto.NewsDetailDTO;
import com.example.selectfront.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@Controller
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsPageMoveController {
    private final NewsService newsService;

    @GetMapping("/create")
    public String create() {
        return "admin_news_create";
    }

    @GetMapping("/detail")
    public String detail(@RequestParam int id , Model model) {
        model.addAttribute("id", id);
        return "detail_news";
    }
    @GetMapping("/update")
    public String update(@RequestParam long id , Model model) {
        model.addAttribute("postId", id);
        NewsDetailDTO newsDetailDTO = newsService.getNews(id);
        model.addAttribute("detail", newsDetailDTO);

        return "admin_news_update";
    }
}
