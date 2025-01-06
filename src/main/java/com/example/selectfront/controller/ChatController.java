package com.example.selectfront.controller;

import com.example.selectfront.dto.chat.ChatMessageRequestDTO;
import com.example.selectfront.dto.chat.ChatRequestDTO;
import com.example.selectfront.dto.chat.ChatResponseDTO;
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
        System.out.println(chatRequestDTO.getRole());
        System.out.println("send");
        return chatService.sendMessage(chatRequestDTO);
    }
    @GetMapping("/messages")
    public ResponseEntity<Map<String, List<ChatResponseDTO>>> getChatMessages(
            @RequestParam String orderId,
            @RequestParam Long fromTimestamp) {
        return chatService.getChatMessagesByRole(orderId,fromTimestamp);
    }
}
