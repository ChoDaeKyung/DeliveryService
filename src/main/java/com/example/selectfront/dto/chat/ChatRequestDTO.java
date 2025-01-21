package com.example.selectfront.dto.chat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatRequestDTO {
    private String orderId;
    private String userId;
    private String role;
    private String message;
}
