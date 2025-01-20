package com.example.selectfront.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class PaymentController {

    private final RestTemplate restTemplate;
    private final String TOSS_SECRET_KEY = "test_sk_Poxy1XQL8RWb2W29djeL37nO5Wml"; // 토스 결제 시크릿 키

    @GetMapping("/success")
    public ResponseEntity<String> handleSuccess(
            @RequestParam String paymentKey,
            @RequestParam String orderId,
            @RequestParam String amount
    ) {
        System.out.println("paymentKey is :: " + paymentKey);
        System.out.println("orderId is :: " + orderId);
        System.out.println("amount is :: " + amount);

        // amount를 정수로 변환
        int price;
        try {
            price = Integer.parseInt(amount);
        } catch (NumberFormatException e) {
            System.out.println("amount 변환 실패: " + amount);
            return ResponseEntity.status(400).body("Invalid amount format");
        }

        String paymentApiUrl = "https://api.tosspayments.com/v1/payments/confirm";
        String credentials = TOSS_SECRET_KEY + ":";
        String authorization = "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());

        Map<String, String> requestBody = Map.of(
                "paymentKey", paymentKey,
                "orderId", orderId,
                "amount", String.valueOf(price) // 정수로 변환한 amount를 다시 문자열로 변환
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorization);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(paymentApiUrl, requestEntity, Map.class);


            System.out.println("Response Body: " + response.getBody());

            // response.getBody()가 null인지 확인
            if (response.getBody() == null) {
                System.out.println("response.getBody() is null");
                return ResponseEntity.status(500).body("결제 처리 중 오류가 발생했습니다. 응답 본문이 없습니다.");
            }

            // 결제 성공 처리
            if (response.getStatusCode().is2xxSuccessful()) {
                Map responseBody = response.getBody();
                String userId = ((Map<String, String>) responseBody.get("metadata")).get("userId");
                String orderName = (String) responseBody.get("orderName");
                System.out.println("userId :: " + userId);
                if (userId == null) {
                    System.out.println("customerName is null in responseBody");
                    return ResponseEntity.status(500).body("결제 처리 중 오류가 발생했습니다. 사용자 ID를 가져올 수 없습니다.");
                }

                String message = orderName;
                String status = "배달전";

                Map<String, Object> requestBodys = new HashMap<>();
                requestBodys.put("userId", userId);
                requestBodys.put("message", message);
                requestBodys.put("price", price);
                requestBodys.put("status", status);
                requestBodys.put("orderId", orderId);

                restTemplate.postForEntity(
                        "http://localhost:7077/webs/api/order",
                        requestBodys,
                        String.class
                );

                return ResponseEntity.ok("결제가 성공적으로 처리되었습니다.");
            } else {
                return ResponseEntity.status(400).body("결제 검증에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("결제 처리 중 오류가 발생했습니다.");
        }
    }
}
