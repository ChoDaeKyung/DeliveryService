package com.example.selectfront.dto.chat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChatMessageRequestDTO {
    private String orderId;
    private Long fromTimestamp;
}
