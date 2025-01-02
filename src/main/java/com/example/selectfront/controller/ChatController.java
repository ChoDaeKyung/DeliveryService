package com.example.selectfront.controller;

import com.example.selectfront.dto.chat.ChatRequestDTO;
import com.example.selectfront.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<?> sendChat(@RequestBody ChatRequestDTO chatRequestDTO) {
        return chatService.sendMessage(chatRequestDTO);
    }
    @GetMapping("/messages")
    public ResponseEntity<Map<String, List<ChatRequestDTO>>> getChatMessages(@RequestParam String orderId) {
        // ChatService를 통해 역할별로 메시지 가져오기
        return chatService.getChatMessagesByRole(orderId);
    }
}
