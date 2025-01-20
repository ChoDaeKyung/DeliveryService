package com.example.paymentservice.service;

import com.example.paymentservice.dto.OrderRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.MessageAttributeValue;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final SqsClient sqsClient;
    private final String queueUrl = "https://sqs.ap-northeast-2.amazonaws.com/879381276515/deliveryStatus";
    private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int ORDER_ID_LENGTH = 9;

    public void CompleteOrder(OrderRequestDTO orderRequestDTO) {
        // 필드를 하나씩 분해하여 메시지 작성
        String messageBody = String.format(
                "message=%s,price=%d",
                orderRequestDTO.getMessage(),
                orderRequestDTO.getPrice()
        );

        // 랜덤 Order ID 생성
        String randomOrderId = generateRandomOrderId();

        Map<String, MessageAttributeValue> messageAttributes = buildMessageAttributes(
                orderRequestDTO.getStatus(), getCurrentTimestamp(), randomOrderId, orderRequestDTO.getUserId());

        // SQS 메시지 전송
        try {
            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .messageBody(messageBody)
                    .messageAttributes(messageAttributes)
                    .build();

            sqsClient.sendMessage(sendMessageRequest);
            System.out.println("SQS 메시지 전송 성공: " + messageBody);
        } catch (Exception e) {
            throw new RuntimeException("SQS 메시지 전송 실패", e);
        }
    }

    private Map<String, MessageAttributeValue> buildMessageAttributes(String status, String timestamp, String orderId, String userId) {
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