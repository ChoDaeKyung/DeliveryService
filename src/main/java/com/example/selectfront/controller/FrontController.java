package com.example.selectfront.controller;

import com.example.selectfront.dto.GoToMainResponseDTO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

@Controller
public class FrontController {

    @GetMapping("/menu")
    public String menu() {
        return "menu";
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
}
