package com.example.selectfront.client;

import com.example.selectfront.dto.chat.ChatRequestDTO;
import com.example.selectfront.dto.location.LocationRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "LocationClient", url="${swfm.service-url}/location")
public interface LocationClient {

    @PostMapping("/update-location")
    ResponseEntity<String> updateLocation(@RequestBody LocationRequestDTO locationRequestDTO);


    @GetMapping("/get-delivery-location")
    ResponseEntity<Map<String, Double>> getDeliveryLocation(@RequestParam("deliveryPersonId") String deliveryPersonId);
}
