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
    @GetMapping("/about")
    public String about() {
        return "/bootstrap/about";
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

    @GetMapping("/news")
    public String news() {
        return "news";
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

    @GetMapping("/mypage/cartList")
    public String cartList() {
        return "cartList";
    }
    @GetMapping("/chat")
    public String chat() {
        return "chat_delivery";
    }
}
