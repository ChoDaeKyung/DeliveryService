package com.example.paymentservice.service;

import com.example.paymentservice.dto.InsertQueueDTO;
import com.example.paymentservice.dto.OrderRequestDTO;
import com.example.paymentservice.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.MessageAttributeValue;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final RestTemplate restTemplate;
    private final String TOSS_SECRET_KEY = "test_sk_Poxy1XQL8RWb2W29djeL37nO5Wml"; // 토스 결제 시크릿 키

    private final SqsClient sqsClient;
    private final String queueUrl = "https://sqs.ap-northeast-2.amazonaws.com/879381276515/deliveryStatus";
    private final RedissonClient redissonClient; // Redis 클라이언트 추가
    private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int ORDER_ID_LENGTH = 20;

    private final PaymentMapper paymentMapper;

    public void CompleteOrder(OrderRequestDTO orderRequestDTO) {
        String lockKey = "lock:order:" + orderRequestDTO.getOrderId(); // Redis 락 키
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // 락을 획득 (최대 대기 시간: 5초, 락 만료 시간: 30초)
            if (lock.tryLock(10, 30, TimeUnit.SECONDS)) {
                String paymentKey = orderRequestDTO.getPaymentKey();
                String orderId = orderRequestDTO.getOrderId();
                String amount = orderRequestDTO.getAmount();

                int price = 0;
                try {
                    price = Integer.parseInt(amount);
                } catch (NumberFormatException e) {
                    System.out.println("amount 변환 실패: " + amount);
                }

                String paymentApiUrl = "https://api.tosspayments.com/v1/payments/confirm";
                String credentials = TOSS_SECRET_KEY + ":";
                String authorization = "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());

                Map<String, String> requestBody = Map.of(
                        "paymentKey", paymentKey,
                        "orderId", orderId,
                        "amount", String.valueOf(price)
                );

                try {
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", authorization);
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
                    ResponseEntity<Map> response = restTemplate.postForEntity(paymentApiUrl, requestEntity, Map.class);

                    System.out.println("Response Body: " + response.getBody());

                    if (response.getBody() == null) {
                        System.out.println("response.getBody() is null");
                    }

                    if (response.getStatusCode().is2xxSuccessful()) {
                        Map responseBody = response.getBody();
                        String userId = ((Map<String, String>) responseBody.get("metadata")).get("userId");
                        String orderName = (String) responseBody.get("orderName");
                        System.out.println("userId :: " + userId);

                        if (userId == null) {
                            System.out.println("customerName is null in responseBody");
                        }

                        String message = orderName;
                        String status = "배달전";

                        InsertQueueDTO build = InsertQueueDTO.builder()
                                .userId(userId)
                                .message(message)
                                .price(price)
                                .status(status)
                                .orderId(orderId)
                                .build();

                        InsertQueue(build);

                    } else {
                        System.out.println("결제 실패");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("다른 작업이 이미 처리 중입니다.");
            }
        } catch (InterruptedException e) {
            throw new RuntimeException("락 획득 실패", e);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock(); // 락 해제
            }
        }
    }

    public void InsertQueue(InsertQueueDTO insertQueueDTO) {
        String messageBody = String.format(
                "message=%s,price=%d",
                insertQueueDTO.getMessage(),
                insertQueueDTO.getPrice()
        );

        String randomOrderId = generateRandomOrderId();

        Map<String, MessageAttributeValue> messageAttributes = buildMessageAttributes(
                insertQueueDTO.getStatus(), getCurrentTimestamp(), randomOrderId, insertQueueDTO.getUserId());

        try {
            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(messageBody)
                    .messageAttributes(messageAttributes)
                    .build();

            sqsClient.sendMessage(sendMessageRequest);
            System.out.println("SQS 메시지 전송 성공: " + messageBody);

            String userId = insertQueueDTO.getUserId();
            paymentMapper.deleteProductsCartList(userId);
            paymentMapper.deleteCompleteProductCartList(userId);
        } catch (Exception e) {
            throw new RuntimeException("SQS 메시지 전송 실패", e);
        }
    }

    private Map<String, MessageAttributeValue> buildMessageAttributes(String status, String timestamp, String orderId, String userId) {
        if (userId.startsWith("\"") && userId.endsWith("\"")) {
            userId = userId.substring(1, userId.length() - 1);
        }
        return Map.of(
                "status", MessageAttributeValue.builder().dataType("String").stringValue(status).build(),
                "timestamp", MessageAttributeValue.builder().dataType("String").stringValue(timestamp).build(),
                "orderId", MessageAttributeValue.builder().dataType("String").stringValue(orderId).build(),
                "userId", MessageAttributeValue.builder().dataType("String").stringValue(userId).build(),
                "riderId", MessageAttributeValue.builder().dataType("String").stringValue("defaultRiderId").build()
        );
    }

    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    private String generateRandomOrderId() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(ORDER_ID_LENGTH);

        for (int i = 0; i < ORDER_ID_LENGTH; i++) {
            int randomIndex = random.nextInt(CHAR_POOL.length());
            sb.append(CHAR_POOL.charAt(randomIndex));
        }

        return sb.toString();
    }
}