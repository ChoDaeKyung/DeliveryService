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
        return deliveryLocation;
    }

    @GetMapping("/get-distance-and-time")
    public ResponseEntity<DistanceResponse> getDistanceAndTime(
            @RequestParam double deliveryLat,
            @RequestParam double deliveryLng,
            @RequestParam double userLat,
            @RequestParam double userLng) {
        try {
            System.out.println("Request Params - deliveryLat: " + deliveryLat +
                    ", deliveryLng: " + deliveryLng + ", userLat: " + userLat + ", userLng: " + userLng);

            DistanceResponse response = locationService.getDistanceAndTime(deliveryLat, deliveryLng, userLat, userLng).block();

            if (response == null) {
                System.err.println("DistanceResponse is null");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new DistanceResponse(0, 0)); // 기본값 반환
            }

            System.out.println("Response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getDistanceAndTime: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new DistanceResponse(0, 0));
        }
    }

}
