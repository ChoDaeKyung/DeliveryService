package com.example.selectfront.service;

import com.example.selectfront.client.LocationClient;
import com.example.selectfront.dto.location.DistanceResponse;
import com.example.selectfront.dto.location.LocationRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LocationService {
    @Value("${kakao.api-key}")
    private String kakaoApiKey;
    private final LocationClient locationClient;

    private final WebClient webClient;
    public ResponseEntity<String> updateLocation(LocationRequestDTO locationRequestDTO) {
        return locationClient.updateLocation(locationRequestDTO);
    }

    public ResponseEntity<Map<String, Double>> getDeliveryLocation(String deliveryPersonId) {
        return locationClient.getDeliveryLocation(deliveryPersonId);
    }

    public Mono<DistanceResponse> getDistanceAndTime(double deliveryLat, double deliveryLng, double userLat, double userLng) {
        String kakaoApiUrl = "https://apis-navi.kakao.com/v1/directions";

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(kakaoApiUrl)
                        .queryParam("origin", deliveryLng + "," + deliveryLat)
                        .queryParam("destination", userLng + "," + userLat)
                        .queryParam("priority", "1")
                        .queryParam("car_fuel", "GASOLINE")
                        .queryParam("car_hipass", "false")
                        .build())
                .header("Authorization", kakaoApiKey)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::parseDistanceResponse);
    }

    private DistanceResponse parseDistanceResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(responseBody);
            double distance = responseJson.path("routes").get(0).path("summary").path("distance").asDouble();
            int duration = responseJson.path("routes").get(0).path("summary").path("duration").asInt();

            return new DistanceResponse(distance, duration);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Kakao API response", e);
        }
    }
}
