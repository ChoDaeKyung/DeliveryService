package com.example.selectfront.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponseDTO {
    private String orderId;
    private String userId;
    private String role;
    private String message;
    private long timestamp;
}
