package com.example.selectfront.controller;

import com.example.selectfront.dto.location.DistanceResponse;
import com.example.selectfront.dto.location.LocationRequestDTO;
import com.example.selectfront.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/location")
@RequiredArgsConstructor
public class LocationApiController {

    private final LocationService locationService;


    @PostMapping("/update-location")
    public ResponseEntity<String> updateLocation(@RequestBody LocationRequestDTO locationRequestDTO) {
        try {
            System.out.println("locationRequestDTO: " + locationRequestDTO);
            // Service 호출
            return locationService.updateLocation(locationRequestDTO);
        }catch (Exception e) {
            // 예상치 못한 오류 처리
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }
    @GetMapping("/get-delivery-location")
    public ResponseEntity<Map<String, Double>> getDeliveryLocation(@RequestParam String deliveryPersonId) {
        System.out.println("deliveryPersonId: " + deliveryPersonId);
        ResponseEntity<Map<String, Double>> deliveryLocation = locationService.getDeliveryLocation(deliveryPersonId);
        System.out.println("deliveryLocation: " + deliveryLocation.getStatusCode());
        System.out.println("deliveryLocation: " + Objects.requireNonNull(deliveryLocation.getBody()).toString());
        System.out.println("deliveryLocation: " + deliveryLocation.getBody());
        System.out.println("deliveryLocation: " + deliveryLocation.getHeaders().getLocation());
        return deliveryLocation;
    }

    @GetMapping("/get-distance-and-time")
    public ResponseEntity<DistanceResponse> getDistanceAndTime(
            @RequestParam double deliveryLat,
            @RequestParam double deliveryLng,
            @RequestParam double userLat,
            @RequestParam double userLng) {
        try {
            // 서비스 호출
            System.out.println("deliveryLat: " + deliveryLat+"deliveryLng: "+deliveryLng+"userLat: "+userLat+"userLng: "+userLng);
            DistanceResponse response = locationService.getDistanceAndTime(deliveryLat, deliveryLng, userLat, userLng).block();
            System.out.println("response: "+response);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
