package com.example.selectfront.controller.community;

import com.example.selectfront.dto.community.NewsDetailDTO;
import com.example.selectfront.dto.community.ReviewDetailDTO;
import com.example.selectfront.service.community.NewsService;
import com.example.selectfront.service.community.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@Controller
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewPageMoveController {

    private final ReviewService reviewService;


    @GetMapping("/update")
    public String update(@RequestParam long id , Model model) {
        model.addAttribute("postId", id);
        ReviewDetailDTO reviewDetailDTO = reviewService.getReview(id);
        model.addAttribute("detail", reviewDetailDTO);

        return "review_update";
    }

}
