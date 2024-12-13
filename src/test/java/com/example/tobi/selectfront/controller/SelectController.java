package com.example.tobi.selectfront.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SelectController {

    @GetMapping
    public String select() {
        return "main";
    }

}
