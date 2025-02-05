package com.example.selectfront.controller.Test;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {
    @GetMapping("/test")
    public String menu() {
        return "/Test/test";
    }
    @GetMapping("/locationTest")
    public String locationTest() {
        return "/Test/location_test";
    }
}
