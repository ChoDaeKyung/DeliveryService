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
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1/directions") // 정확한 경로 사용
                        .queryParam("origin", deliveryLng + "," + deliveryLat)
                        .queryParam("destination", userLng + "," + userLat)
                        .queryParam("priority", "RECOMMEND") // "RECOMMEND"로 우선순위 설정
                        .queryParam("car_fuel", "GASOLINE")
                        .queryParam("car_hipass", "false")
                        .queryParam("alternatives", "false") // 대체 경로 사용 안 함
                        .queryParam("road_details", "false") // 도로 세부사항 사용 안 함
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoApiKey) // 카카오 API 키 포함
                .retrieve()
                .bodyToMono(String.class)
                .map(this::parseDistanceResponse);
    }

    private DistanceResponse parseDistanceResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(responseBody);

            if (!responseJson.has("routes") || responseJson.get("routes").isEmpty()) {
                throw new RuntimeException("Kakao API 응답에 'routes' 데이터가 없습니다.");
            }

            JsonNode summary = responseJson.path("routes").get(0).path("summary");
            double distance = summary.path("distance").asDouble();
            int duration = summary.path("duration").asInt();

            return new DistanceResponse(distance, duration);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Kakao API response", e);
        }
    }

}
