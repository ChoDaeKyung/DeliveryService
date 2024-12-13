package com.example.selectfront.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

    @GetMapping("/admin/insertmenu")
    public String insertmenu() {
        return "insertmenu";
    }

}
