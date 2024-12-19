//package com.example.selectfront.controller;
//
//import com.example.selectfront.dto.GoToMainResponseDTO;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.ui.Model;
//
//@Controller
//public class SelectController {
//
//    @GetMapping("/main")
//    public String main(
//            @RequestParam(name="sectionId",defaultValue = "") String sectionId,
//            Model model
//    ) {
//        model.addAttribute("sectionId", sectionId);
//        return "main";
//    }
//
//    @GetMapping("/select")
//    public String select() {
//        return "select";
//    }
//
//}
