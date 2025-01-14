package com.example.selectfront.service;

import com.example.selectfront.client.DeliveryClient;
import com.example.selectfront.dto.chat.ChatMessageRequestDTO;
import com.example.selectfront.dto.chat.ChatRequestDTO;
import com.example.selectfront.dto.chat.ChatResponseDTO;
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
    public ResponseEntity<Map<String, List<ChatResponseDTO>>> getChatMessagesByRole(String orderId,long fromTimestamp) {
        // 메시지 목록을 Redis에서 가져옵니다.
        List<Object> messagesFromRedis = deliveryClient.getMessages(orderId,fromTimestamp).getBody();

        // 역할별로 메시지를 분리하여 저장할 맵
        Map<String, List<ChatResponseDTO>> roleMessages = new HashMap<>();

        for (Object messageObj : Objects.requireNonNull(messagesFromRedis)) {
            try {
                // 메시지 객체가 Map 형태일 경우, 이를 JSON 문자열로 변환
                String messageJson = objectMapper.writeValueAsString(messageObj);
                System.out.println("Message JSON: " + messageJson);  // 메시지 출력

                // JSON 파싱
                ChatResponseDTO chatResponseDTO = objectMapper.readValue(messageJson, ChatResponseDTO.class);

                // 역할에 맞는 리스트에 메시지 추가
                roleMessages.computeIfAbsent(chatResponseDTO.getRole(), k -> new ArrayList<>()).add(chatResponseDTO);
            } catch (Exception e) {
                System.err.println("Error processing message: " + e.getMessage());
            }
        }


        // 역할별로 분리된 메시지 목록을 반환
        return new ResponseEntity<>(roleMessages, HttpStatus.OK);
    }

}
