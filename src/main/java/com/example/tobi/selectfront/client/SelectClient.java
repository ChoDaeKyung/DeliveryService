package com.example.tobi.selectfront.client;

import com.example.tobi.selectfront.dto.GetSelectProductResponseDTO;
import com.example.tobi.selectfront.dto.SelectRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "SelectClient", url="${swfm.select-service-url}")
public interface SelectClient {

    @PostMapping
    String insertSelect(@RequestBody SelectRequestDTO selectRequestDTO);

    @GetMapping
    List<GetSelectProductResponseDTO> getSelectProduct();
}
