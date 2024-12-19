package com.example.selectfront.client;

import com.example.selectfront.dto.AddCompleteProductRequestDTO;
import com.example.selectfront.dto.InsertCartRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "AdminClient", url="${swfm.admin-service-url}")
public interface AdminClient {
    @PostMapping
    String addCompleteProduct(@RequestBody AddCompleteProductRequestDTO addCompleteProductRequestDTO);
}
