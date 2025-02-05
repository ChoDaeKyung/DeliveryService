package com.example.selectfront.controller;

import com.example.selectfront.dto.chat.ChatRequestDTO;
import com.example.selectfront.dto.chat.ChatResponseDTO;
import com.example.selectfront.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatApiController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<?> sendChat(@RequestBody ChatRequestDTO chatRequestDTO) {
        log.info("Received chat message with role: {}", chatRequestDTO.getRole());
        log.info("send method called");
        return chatService.sendMessage(chatRequestDTO);
    }

    @GetMapping("/messages")
    public ResponseEntity<Map<String, List<ChatResponseDTO>>> getChatMessages(
            @RequestParam String orderId,
            @RequestParam Long fromTimestamp) {
        log.info("Fetching messages for orderId: {}, fromTimestamp: {}", orderId, fromTimestamp);
        ResponseEntity<Map<String, List<ChatResponseDTO>>> chatMessagesByRole = chatService.getChatMessagesByRole(orderId, fromTimestamp);
        log.info("Retrieved messages: {}", chatMessagesByRole.getBody());
        return chatMessagesByRole;
    }
}
