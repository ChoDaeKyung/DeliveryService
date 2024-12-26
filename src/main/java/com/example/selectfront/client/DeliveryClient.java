package com.example.selectfront.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "deliveryClient", url="${swfm.service-url}/delivery")
public interface DeliveryClient {

    @GetMapping("/receive")
    List<String> deliver(@RequestParam String userId);
}
