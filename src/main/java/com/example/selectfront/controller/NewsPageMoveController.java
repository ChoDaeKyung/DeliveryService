package com.example.selectfront.controller;

import com.example.selectfront.dto.NewsDetailDTO;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@Controller
@RequestMapping("/news")
public class NewsPageMoveController {

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
    public String update(@RequestParam int id , Model model) {
        model.addAttribute("postId", id);
        return "admin_news_update";
    }
}
