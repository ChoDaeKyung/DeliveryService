package com.example.selectfront.controller;

import com.example.selectfront.dto.GetSelectProductResponseDTO;
import com.example.selectfront.dto.SelectRequestDTO;
import com.example.selectfront.service.SelectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webs/api/sel ect")
public class SelectApiController {

    private final SelectService selectService;

    @PostMapping
    public String insertSelect(
            @RequestBody SelectRequestDTO selectRequestDTO
    ){
        System.out.println("selectRequestDTO: " + selectRequestDTO);
        return selectService.insertSelect(selectRequestDTO);
    }

    @GetMapping
    public List<GetSelectProductResponseDTO> getProducts() {
        return selectService.getProducts();
    }
}
