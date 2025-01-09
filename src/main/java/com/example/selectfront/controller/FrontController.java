package com.example.selectfront.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontController {

    @GetMapping("/menu")
    public String menu() {
        return "menu";
    }
    @GetMapping("/index")
    public String index() {
        return "/bootstrap/index";
    }
    @GetMapping("/book")
    public String book() {
        return "/bootstrap/book";
    }
    @GetMapping("/news")
    public String about() {
        return "/bootstrap/news";
    }
    @GetMapping("/review")
    public String review() {
        return "/bootstrap/review";
    }
    @GetMapping("/menus")
    public String menus() {
        return "/bootstrap/menu";
    }
    @GetMapping("/market")
    public String market() {
        return "market";
    }

    @GetMapping("/howtouse")
    public String howtouse() {
        return "howtouse";
    }


    @GetMapping("/online")
    public String online() {
        return "online";
    }

    @GetMapping("/select")
    public String select() {
        return "select";
    }

    @GetMapping("/admin/addCompleteProduct")
    public String addCompleteProduct() {
        return "addCompleteProduct";
    }

    @GetMapping("/admin/addProduct")
    public String addProduct() {
        return "addProduct";
    }

    @GetMapping("/admin/addSideMenu")
    public String addSideMenu() {
        return "addSideMenu";
    }

    @GetMapping("/mypage/cartList")
    public String cartList() {
        return "cartList";
    }

    @GetMapping("/chat")
    public String chat() {
        return "chat_delivery";
    }

    @GetMapping("/mypage/availableReview")
    public String availableReview() {
        return "/review/availableReview";
    }

    @GetMapping("/mypage/myReviewList")
    public String MyReviewList() {
        return "/review/myReview";
    }
}
