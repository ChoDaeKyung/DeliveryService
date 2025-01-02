package com.example.selectfront.service;

import com.example.selectfront.client.DeliveryClient;
import com.example.selectfront.dto.chat.ChatRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final DeliveryClient deliveryClient;
    private final ObjectMapper objectMapper;

    public ResponseEntity<String> sendMessage(ChatRequestDTO chatRequestDTO) {
     return deliveryClient.chatSend(chatRequestDTO);
    }
    public ResponseEntity<Map<String, List<ChatRequestDTO>>> getChatMessagesByRole(String orderId) {
        // 메시지 목록을 Redis에서 가져옵니다.
        List<Object> messagesFromRedis = deliveryClient.getMessages(orderId).getBody();

        // 역할별로 메시지를 분리하여 저장할 맵
        Map<String, List<ChatRequestDTO>> roleMessages = new HashMap<>();

        for (Object messageObj : Objects.requireNonNull(messagesFromRedis)) {
            try {
                // 메시지를 ChatRequestDTO 객체로 변환
                String messageJson = messageObj.toString();
                ChatRequestDTO chatRequestDTO = objectMapper.readValue(messageJson, ChatRequestDTO.class);

                // 역할에 맞는 리스트에 메시지 추가
                roleMessages.computeIfAbsent(chatRequestDTO.getRole(), k -> new ArrayList<>()).add(chatRequestDTO);
            } catch (Exception e) {
                System.err.println("Error processing message: " + e.getMessage());
            }
        }

        // 역할별로 분리된 메시지 목록을 반환
        return new ResponseEntity<>(roleMessages, HttpStatus.OK);
    }

}
